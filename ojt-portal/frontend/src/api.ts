import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/traineeportal/",
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    Accept: "application/json",
  },
});

let accessToken: string | null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Subscription mechanism for token changes
type TokenObserver = (token: string | null) => void;
const observers: TokenObserver[] = [];

export const subscribeToTokenChanges = (callback: TokenObserver) => {
  observers.push(callback);
  // Immediately trigger with current token to ensure sync
  callback(accessToken);
  return () => {
    const index = observers.indexOf(callback);
    if (index > -1) observers.splice(index, 1);
  };
};

// Function to set access token
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  // Persist to sessionStorage to survive page refreshes
  if (token) {
    sessionStorage.setItem("accessToken", token);
  } else {
    sessionStorage.removeItem("accessToken");
  }
  // Notify all subscribers
  observers.forEach((cb) => cb(token));
};

// Function to get access token
export const getAccessToken = () => {
  // If not in memory, try to get from sessionStorage
  if (!accessToken) {
    accessToken = sessionStorage.getItem("accessToken");
  }
  return accessToken;
};

accessToken = getAccessToken();

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token expires within the next 60 seconds
    return payload.exp <= currentTime + 60;
  } catch {
    return true;
  }
};

// Encapsulated refresh function to avoid duplicate calls
// EXPORTED so that AuthContext and loaders can share the same refresh promise
export const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log("Access token expired. Attempting refresh...");
      const response = await instance.post("/auth/refresh");
      const { tokens } = response.data;
      const newToken = tokens.accessToken;
      setAccessToken(newToken);
      return newToken;
    } catch (e) {
      setAccessToken(null);
      throw e;
    } finally {
      isRefreshing = false;
      // Allow GC; keep last promise only until awaited callers finish
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();
  return refreshPromise;
};

// Request interceptor to add access token
instance.interceptors.request.use(async (config) => {
  // Skip auth endpoints and public endpoints to prevent loops
  const url = config.url || "";
  const isPublicEndpoint =
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/api/password/"); // Password reset endpoints are public

  // Ensure latest token from storage
  const current = getAccessToken();

  if (!isPublicEndpoint) {
    // Proactively refresh if token is missing or expired
    if (!current || isTokenExpired(current)) {
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${newToken}`;
          return config;
        }
      } catch (e) {
        // Propagate error so caller/response interceptor can handle (e.g., redirect to login)
        return Promise.reject(e);
      }
    }
  }

  // Use whichever token is available (fresh or existing)
  const tokenToUse = getAccessToken();
  if (tokenToUse) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${tokenToUse}`;
  }
  return config;
});

// Response interceptor for token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting globally for better UX
    if (error.response?.status === 429) {
      const message = error.response?.data?.message || "Too many requests. Please slow down.";
      console.warn("Rate limit exceeded:", message);
      // Return the error with custom message for components to display
      error.message = message;
      return Promise.reject(error);
    }

    // Don't attempt token refresh for the refresh endpoint itself to prevent infinite loops
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Don't attempt token refresh for login endpoint
    if (originalRequest.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // Don't attempt token refresh for password reset endpoints (they are public)
    if (originalRequest.url?.includes("/api/password/")) {
      return Promise.reject(error);
    }

    // Check for 401 status OR expired token
    if ((error.response?.status === 401 || isTokenExpired(accessToken)) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token (refresh token sent automatically as httpOnly cookie)
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("No new token after refresh");
        console.log("Token refreshed successfully in interceptor");

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed: clear token and let app routing handle redirect
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;