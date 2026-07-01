import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";
import "isomorphic-fetch";

class MicrosoftGraphService {
    constructor() {
        this.clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
        this.clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
        this.tenantId = process.env.MICROSOFT_GRAPH_TENANT_ID;
        this.senderEmail = process.env.MICROSOFT_GRAPH_EMAIL;
        this.scopes = [
            process.env.MICROSOFT_GRAPH_SCOPES ||
            "https://graph.microsoft.com/.default",
        ];

        if (
            !this.clientId ||
            !this.clientSecret ||
            !this.tenantId ||
            !this.senderEmail
        ) {
            console.error(
                "Microsoft Graph configuration incomplete. Required: CLIENT_ID, CLIENT_SECRET, TENANT_ID, EMAIL"
            );
            throw new Error("Microsoft Graph configuration incomplete");
        }

        this.msalConfig = {
            auth: {
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                authority: `https://login.microsoftonline.com/${this.tenantId}`,
            },
        };

        this.cca = new ConfidentialClientApplication(this.msalConfig);
        this.graphClient = null;

        // Token management properties
        this.tokenData = null;
        this.tokenExpiresAt = null;
        this.isRefreshing = false;
        this.refreshPromise = null;

        // Token refresh buffer (5 minutes before expiration)
        this.TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    /**
     * Check if the current token is expired or will expire soon
     */
    isTokenExpired() {
        if (!this.tokenExpiresAt) {
            return true;
        }

        const now = Date.now();
        const expiresWithBuffer = this.tokenExpiresAt - this.TOKEN_REFRESH_BUFFER;

        return now >= expiresWithBuffer;
    }

    /**
     * Get token status for debugging
     */
    getTokenStatus() {
        if (!this.tokenData || !this.tokenExpiresAt) {
            return { status: "no_token", expiresAt: null, timeUntilExpiry: null };
        }

        const now = Date.now();
        const timeUntilExpiry = this.tokenExpiresAt - now;
        const isExpired = this.isTokenExpired();

        return {
            status: isExpired ? "expired" : "valid",
            expiresAt: new Date(this.tokenExpiresAt).toISOString(),
            timeUntilExpiry: Math.max(0, timeUntilExpiry),
            timeUntilExpiryMinutes: Math.max(0, Math.floor(timeUntilExpiry / 60000)),
        };
    }

    /**
     * Safely calculate token expiration time
     */
    calculateTokenExpiration(response) {
        try {
            // Try to use expiresOn first (it's a Date object from MSAL)
            if (response.expiresOn && response.expiresOn instanceof Date) {
                return response.expiresOn.getTime();
            }

            // Fallback to expiresIn (seconds until expiration)
            if (response.expiresIn && typeof response.expiresIn === "number") {
                return Date.now() + response.expiresIn * 1000;
            }

            // If both are missing or invalid, default to 1 hour from now
            console.warn("⚠️ Token expiration data missing, defaulting to 1 hour");
            return Date.now() + 60 * 60 * 1000; // 1 hour
        } catch (error) {
            console.warn(
                "⚠️ Error calculating token expiration, defaulting to 1 hour:",
                error
            );
            return Date.now() + 60 * 60 * 1000; // 1 hour
        }
    }

    /**
     * Acquire a new access token
     */
    async acquireNewToken() {
        try {
            console.log("🔄 Acquiring new Microsoft Graph token...");

            const clientCredentialRequest = {
                scopes: this.scopes,
            };

            const response = await this.cca.acquireTokenByClientCredential(
                clientCredentialRequest
            );

            if (!response || !response.accessToken) {
                throw new Error("Failed to acquire access token");
            }

            // Store token data with safely calculated expiration time
            this.tokenData = response;
            this.tokenExpiresAt = response.expiresOn?.getTime() || null;

            console.log(
                `🔑 New Microsoft Graph token acquired, expires at: ${new Date(
                    this.tokenExpiresAt
                ).toISOString()}`
            );
            console.log("🔍 Token response details:", {
                hasAccessToken: !!response.accessToken,
                expiresOn: response.expiresOn,
                expiresIn: response.expiresIn,
                calculatedExpiration: new Date(this.tokenExpiresAt).toISOString(),
            });

            return response;
        } catch (error) {
            console.error("❌ Failed to acquire new token:", error);
            console.error("❌ Token response details:", {
                hasResponse: !!error.response,
                errorCode: error.code,
                errorMessage: error.message,
            });
            throw error;
        }
    }

    /**
     * Ensure we have a valid token, refresh if necessary
     */
    async ensureValidToken() {
        // If we're already refreshing, wait for that to complete
        if (this.isRefreshing && this.refreshPromise) {
            console.log("🔄 Token refresh already in progress, waiting...");
            return await this.refreshPromise;
        }

        // Check if token needs refresh
        if (this.isTokenExpired()) {
            console.log("🔄 Token expired or expiring soon, refreshing...");

            this.isRefreshing = true;
            this.refreshPromise = this.acquireNewToken().finally(() => {
                this.isRefreshing = false;
                this.refreshPromise = null;
            });

            return await this.refreshPromise;
        }

        return this.tokenData;
    }

    /**
     * Initialize the Microsoft Graph client with authentication
     */
    async initializeGraphClient() {
        try {
            // Ensure we have a valid token
            const tokenResponse = await this.ensureValidToken();

            // Create Graph client with the access token
            this.graphClient = Client.init({
                authProvider: (done) => {
                    done(null, tokenResponse.accessToken);
                },
            });

            console.log("✅ Microsoft Graph client initialized successfully");
            return this.graphClient;
        } catch (error) {
            console.error("❌ Failed to initialize Microsoft Graph client:", error);
            throw new Error(
                `Microsoft Graph initialization failed: ${error.message}`
            );
        }
    }

    /**
     * Send email using Microsoft Graph
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email
     * @param {string} options.subject - Email subject
     * @param {string} options.html - Email HTML content
     * @param {string} options.text - Plain text alternative (optional)
     * @param {Array} options.cc - CC recipients (optional)
     * @param {Array} options.bcc - BCC recipients (optional)
     * @returns {Promise} - Resolves when email sent, rejects on error
     */
    async sendEmail(options) {
        return await this.sendEmailWithRetry(options, 2); // Allow up to 2 retries
    }

    /**
     * Send email with automatic retry on token expiration
     */
    async sendEmailWithRetry(options, maxRetries = 2) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
            try {
                // Ensure we have a valid token before each attempt
                await this.ensureValidToken();

                if (!this.graphClient) {
                    await this.initializeGraphClient();
                }

                // Prepare recipients
                const toRecipients = options.to.split(",").map((email) => ({
                    emailAddress: {
                        address: email.trim(),
                    },
                }));

                const ccRecipients = options.cc
                    ? options.cc.split(",").map((email) => ({
                        emailAddress: {
                            address: email.trim(),
                        },
                    }))
                    : [];

                const bccRecipients = options.bcc
                    ? options.bcc.split(",").map((email) => ({
                        emailAddress: {
                            address: email.trim(),
                        },
                    }))
                    : [];

                // Prepare message
                const message = {
                    subject: options.subject,
                    body: {
                        contentType: "HTML",
                        content: options.html || options.text || "",
                    },
                    toRecipients: toRecipients,
                    ccRecipients: ccRecipients,
                    bccRecipients: bccRecipients,
                    from: {
                        emailAddress: {
                            address: this.senderEmail,
                        },
                    },
                };

                // Add attachments if present
                if (options.attachments && options.attachments.length > 0) {
                    message.attachments = options.attachments.map((attachment) => ({
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: attachment.filename || attachment.name,
                        contentType: attachment.contentType,
                        contentBytes: attachment.content || attachment.contentBytes,
                        size: Buffer.from(
                            attachment.content || attachment.contentBytes,
                            "base64"
                        ).length,
                    }));
                }

                // Send email
                const result = await this.graphClient
                    .api(`/users/${this.senderEmail}/sendMail`)
                    .post({
                        message: message,
                        saveToSentItems: true,
                    });

                console.log(
                    `✅ Email sent successfully via Microsoft Graph to: ${options.to} (attempt ${attempt})`
                );
                return {
                    success: true,
                    messageId: result?.id || "sent",
                    info: result,
                };
            } catch (error) {
                lastError = error;
                console.error(
                    `❌ Microsoft Graph email sending failed (attempt ${attempt}):`,
                    error
                );

                // Check if this is a token expiration error
                const isTokenError =
                    error.code === "Unauthorized" ||
                    error.code === "InvalidAuthenticationToken" ||
                    error.message?.includes("token") ||
                    error.message?.includes("Lifetime validation failed") ||
                    error.message?.includes("expired") ||
                    error.message?.includes("Authentication");

                if (isTokenError && attempt <= maxRetries) {
                    console.log(
                        `🔄 Token expired, acquiring new token and retrying (attempt ${attempt + 1
                        }/${maxRetries + 1})...`
                    );

                    // Force token refresh
                    this.tokenData = null;
                    this.tokenExpiresAt = null;
                    this.graphClient = null;

                    // Wait a bit before retrying
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    continue;
                }

                // Handle specific Graph API errors
                if (error.code === "Forbidden") {
                    console.error(
                        "Microsoft Graph permissions error: Check Mail.Send permissions"
                    );
                } else if (error.code === "Unauthorized") {
                    console.error(
                        "Microsoft Graph authentication error: Check credentials"
                    );
                }

                // If this is the last attempt or not a token error, break the loop
                if (attempt > maxRetries || !isTokenError) {
                    break;
                }
            }
        }

        // If we get here, all attempts failed
        console.error(`❌ All ${maxRetries + 1} email sending attempts failed`);
        throw lastError;
    }

    /**
     * Debug method to log current configuration (without sensitive data)
     */
    debugConfiguration() {
        console.log("🔍 Microsoft Graph Service Configuration:", {
            tenantId: this.tenantId,
            senderEmail: this.senderEmail,
            scopes: this.scopes,
            hasClientId: !!this.clientId,
            hasClientSecret: !!this.clientSecret,
            tokenStatus: this.getTokenStatus(),
        });
    }
}

export default MicrosoftGraphService;
