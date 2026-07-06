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

// Utility function to fetch user profile via API
const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get("/auth/me");
    if (response.status === 200 && response.data.user) {
      const user = response.data.user;
      return {
        id: user.id || user.userId,
        username: user.username,
        email: user.email,
        NIC: user.NIC,
        status: user.status,
        nickname: user.username,
        notifyChat: user.notifyChat,
        notifyPayment: user.notifyPayment,
        notifyHoliday: user.notifyHoliday,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
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

  // Since token is HTTPOnly, we fetch user profile when we know we're authenticated
  // (e.g., after login or refresh). Alternatively, this could also be driven by API calls directly.
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile().then((userData) => {
        setUser(userData);
      });
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
      // Always try to fetch profile first (maybe we have a valid cookie)
      const userData = await fetchUserProfile();
      if (userData) {
        // Assume we have an access token cookie since we fetched data
        setAccessTokenState("cookie_token"); 
        setUser(userData);
      } else {
        // If it failed, try to refresh
        console.log("AuthContext: Profile fetch failed, using shared refresh...");
        await refreshAccessToken();
        const freshData = await fetchUserProfile();
        if (freshData) {
          setAccessTokenState("cookie_token");
          setUser(freshData);
        } else {
           setAccessTokenState(null);
        }
      }
    } catch (error) {
      console.log("Token refresh or profile fetch failed:", error);
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
        // Let the state know we logged in by setting a dummy token in memory
        // since the actual token is in the HttpOnly cookie.
        setAccessToken("cookie_token");
        // Also fetch user profile immediately to ensure synchronous login feel
        const userData = await fetchUserProfile();
        if (userData) setUser(userData);

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