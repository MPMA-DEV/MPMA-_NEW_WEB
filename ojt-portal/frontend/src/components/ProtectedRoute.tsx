import { Navigate, useNavigation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageLoader from "./ui/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
  allowStaff?: boolean;
}


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

  // If no valid user or token, redirect to login
  if (!authUser || !authToken) {
    return <Navigate to="/login" replace />;
  }

  const user = authUser;

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