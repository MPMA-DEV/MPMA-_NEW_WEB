import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import api, { setAccessToken, getAccessToken, isTokenExpired, subscribeToTokenChanges, refreshAccessToken } from "../api";

export interface User {
  id: string;
  nickname: string;
  email: string;
  NIC: string;
  username: string;
  status: string;
  notifyChat?: boolean;
  notifyPayment?: boolean;
  notifyHoliday?: boolean;
}

// Utility function to decode JWT token and extract user data
const getUserFromToken = (token: string | null): User | null => {
  if (!token) {
    return null;
  }

  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Extract user data from token payload
    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      NIC: payload.NIC,
      status: payload.status,
      nickname: payload.username, // Use username as nickname fallback
      notifyChat: payload.notifyChat,
      notifyPayment: payload.notifyPayment,
      notifyHoliday: payload.notifyHoliday,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, loginType?: "trainee" | "staff") => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user state when access token changes
  useEffect(() => {
    if (accessToken) {
      const userData = getUserFromToken(accessToken);
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [accessToken]);

  // Subscribe to token changes from API module (replaces polling)
  useEffect(() => {
    const unsubscribe = subscribeToTokenChanges((newToken) => {
      setAccessTokenState(newToken);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Initialize token from sessionStorage first
    const storedToken = getAccessToken();

    // If token exists but is expired (or nearly), try to refresh instead of treating as logged in
    if (storedToken && !isTokenExpired(storedToken)) {
      setAccessTokenState(storedToken);
      setIsLoading(false);
    } else {
      // Either no token or expired token -> attempt refresh flow
      tryRefreshToken();
    }
  }, []);

  const tryRefreshToken = async () => {
    try {
      const currentToken = getAccessToken();

      // Refresh token 2 minutes before expiry for better UX
      if (!currentToken || isTokenExpired(currentToken)) {
        console.log("AuthContext: Token expired, using shared refresh...");
        // Use the SHARED refreshAccessToken to avoid race conditions with loaders
        await refreshAccessToken();
        // IMPORTANT: Re-read the token from the API module after refresh completes
        // This ensures we get the latest token even if subscription hasn't fired yet
        const newToken = getAccessToken();
        if (newToken) {
          setAccessTokenState(newToken);
        }
      } else {
        // Token is still valid, just set it in state
        setAccessTokenState(currentToken);
      }
    } catch (error) {
      // Refresh failed, user needs to login again
      console.log("Token refresh failed:", error);
      setAccessTokenState(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
    loginType: "trainee" | "staff" = "trainee"
  ): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
        loginType,
      });

      if (response.status === 200) {
        const { tokens } = response.data;

        // Store access token via api helper (notifies subscribers)
        setAccessToken(tokens.accessToken);

        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Invalid username or password");
        } else if (error.response?.status === 403) {
          throw new Error(error.response?.data?.message || "Your account is inactive.");
        } else if (error.response?.status === 404) {
          throw new Error("User not found");
        } else if (error.response?.status === 400) {
          throw new Error("Invalid input data");
        } else if (error.response?.status === 429) {
          // Rate limit exceeded - extract message from backend response
          const message = error.response?.data?.message || "Too many login attempts, please try again later.";
          throw new Error(message);
        }
      }
      throw new Error("Login failed. Please try again later.");
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to revoke refresh token
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}