import { Navigate, useNavigation } from "react-router-dom";
import { useAuth, type User } from "../contexts/AuthContext";
import { getAccessToken, isTokenExpired } from "../api";
import PageLoader from "./ui/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
  allowStaff?: boolean;
}

// Utility to decode user from token (same as AuthContext)
const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      NIC: payload.NIC,
      status: payload.status,
      nickname: payload.username,
      notifyChat: payload.notifyChat,
      notifyPayment: payload.notifyPayment,
      notifyHoliday: payload.notifyHoliday,
    };
  } catch {
    return null;
  }
};

export default function ProtectedRoute({
  children,
  requiresOnboarding = true,
  allowStaff = false,
}: ProtectedRouteProps) {
  const { user: authUser, isLoading, accessToken: authToken } = useAuth();
  const navigation = useNavigation();

  // Show loader while AuthContext is initializing OR while a navigation is in progress
  if (isLoading || navigation.state === "loading") {
    return <PageLoader />;
  }

  // IMPORTANT: If AuthContext hasn't synced yet, check the API module directly
  // This handles the case where the loader refreshed the token but AuthContext
  // hasn't processed the subscription update yet
  let user = authUser;
  let accessToken = authToken;

  if (!user || !accessToken) {
    const rawToken = getAccessToken();
    if (rawToken && !isTokenExpired(rawToken)) {
      // Token is valid in API module, decode user from it
      user = getUserFromToken(rawToken);
      accessToken = rawToken;
      console.log("ProtectedRoute: Using token from API module (AuthContext not synced)");
    }
  }

  // If still no valid token, redirect to login
  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiresOnboarding) {
    // If user paused after documents but before payment, send to payment step
    if (user.status === "Processing") {
      console.log("Processing");
      return <Navigate to="/onboarding/summary" replace />;
    }
    // If user hasn't completed onboarding, send to onboarding start
    if (!user.status || user.status == "Pending") {
      return <Navigate to="/onboarding" replace />;
    }
  } else {
    if (user.status && user.status == "Active" && !allowStaff) {
      return <Navigate to="/trainee" replace />;
    }
  }

  return <>{children}</>;
}