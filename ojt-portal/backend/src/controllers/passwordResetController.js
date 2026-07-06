import { z } from "zod";
import crypto from "crypto";
import { sequalize } from "../database/sequlize.js";
import { TraineeUser, Staff } from "../models/index.js";
import MicrosoftGraphService from "../services/MicrosoftGraphService.js";
import logger from "../config/logger.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

let graphService = null;

const getGraphService = () => {
    if (!graphService) {
        graphService = new MicrosoftGraphService();
    }
    return graphService;
};

export const forgotPassword = async (req, res) => {
    const schema = z.object({
        email: z.string().email("Invalid email format"),
    });

    try {
        const parsedData = schema.parse(req.body);
        const ipAddress =
            req.ip ||
            req.connection?.remoteAddress ||
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

        const successMessage = "If this email exists in our system, you will receive a password reset link shortly.";

        // Find user by email in TraineeUser or Staff
        let user = await TraineeUser.findOne({ where: { email: parsedData.email } });
        let isStaff = false;

        if (!user) {
            user = await Staff.findOne({ where: { email: parsedData.email } });
            if (user) isStaff = true;
        }

        if (!user) {
            return res.status(200).json({ message: successMessage });
        }

        const resetToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.reset_token = tokenHash;
        user.reset_token_expires = expiresAt;
        await user.save();

        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        try {
            const emailService = getGraphService();
            await emailService.sendEmail({
                to: parsedData.email,
                subject: "SLPA OJT Portal - Password Reset Request",
                html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
            });
        } catch (emailError) {
            user.reset_token = null;
            user.reset_token_expires = null;
            await user.save();
            return res.status(500).json({ message: "Failed to send email." });
        }

        return res.status(200).json({ message: successMessage });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const schema = z.object({
        token: z.string().min(1, "Reset token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    try {
        const parsedData = schema.parse(req.body);

        const tokenHash = crypto.createHash('sha256').update(parsedData.token).digest('hex');
        let user = await TraineeUser.findOne({ where: { reset_token: tokenHash } });
        if (!user) {
            user = await Staff.findOne({ where: { reset_token: tokenHash } });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid or already used reset token" });
        }

        if (new Date() > new Date(user.reset_token_expires)) {
            user.reset_token = null;
            user.reset_token_expires = null;
            await user.save();
            return res.status(400).json({ message: "This reset link has expired." });
        }

        user.password = parsedData.password;
        user.reset_token = null;
        user.reset_token_expires = null;
        await user.save();

        return res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const validateResetToken = async (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ valid: false, message: "Token is required" });

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        let user = await TraineeUser.findOne({ where: { reset_token: tokenHash } });
        if (!user) {
            user = await Staff.findOne({ where: { reset_token: tokenHash } });
        }

        if (!user) {
            return res.status(400).json({ valid: false, message: "Invalid reset token" });
        }

        if (new Date() > new Date(user.reset_token_expires)) {
            return res.status(400).json({ valid: false, message: "This reset link has expired" });
        }

        return res.status(200).json({ valid: true, message: "Token is valid" });
    } catch (error) {
        return res.status(500).json({ valid: false, message: "Internal server error" });
    }
};
