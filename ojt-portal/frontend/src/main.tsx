import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";
import { NotificationProvider } from "./contexts/NotificationContext";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Loaders
import {
  traineePaymentsLoader,
  traineeAttendanceLoader,
  traineeCalendarLoader,
  traineeDetailsLoader,
  onboardingSummaryLoader,
  traineeScheduleLoader,
  traineeLayoutLoader,
  authLoader,
} from "./loaders/traineeLoaders";

// Auth Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/trainee/Onboarding";
import OnboardingSummary from "./pages/trainee/OnboardingSummary";

// Layouts
import TraineeLayout from "./components/layout/TraineeLayout";
import StaffLayout from "./components/layout/StaffLayout";

// Trainee Pages
import TraineeDetails from "./pages/trainee/TraineeDetails";
import TraineeAttendance from "./pages/trainee/TraineeAttendance";
import TraineePayments from "./pages/trainee/TraineePayments";
import TraineeCalendar from "./pages/trainee/TraineeCalendar";
import TraineeNotifications from "./pages/trainee/TraineeNotifications";
import TraineeChat from "./pages/trainee/TraineeChat";
import TraineeProfile from "./pages/trainee/TraineeProfile";
import TraineeSchedule from "./pages/trainee/TraineeSchedule";
import EditDetails from "./pages/trainee/EditDetails";
import StaffDashboard from "./pages/StaffDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute requiresOnboarding={false} allowStaff>
        <StaffLayout />
      </ProtectedRoute>
    ),
    loader: authLoader,
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute requiresOnboarding={false}>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding/summary",
    element: (
      <ProtectedRoute requiresOnboarding={false}>
        <OnboardingSummary />
      </ProtectedRoute>
    ),
    loader: onboardingSummaryLoader,
  },
  {
    path: "/trainee",
    element: (
      <ProtectedRoute>
        <TraineeLayout />
      </ProtectedRoute>
    ),
    loader: traineeLayoutLoader, // Fetches all layout data (payments, profile photo, bank permission) during route loading
    children: [
      {
        index: true,
        element: <Navigate to="details" replace />,
      },
      {
        path: "details",
        element: <TraineeDetails />,
        loader: traineeDetailsLoader,
      },
      {
        path: "schedule",
        element: <TraineeSchedule />,
        loader: traineeScheduleLoader,
      },
      {
        path: "attendance",
        element: <TraineeAttendance />,
        loader: traineeAttendanceLoader,
      },
      {
        path: "payments",
        element: <TraineePayments />,
        loader: traineePaymentsLoader,
      },
      {
        path: "calendar",
        element: <TraineeCalendar />,
        loader: traineeCalendarLoader,
      },
      {
        path: "notifications",
        element: <TraineeNotifications />,
        loader: authLoader,
      },
      {
        path: "chat",
        element: <TraineeChat />,
        loader: authLoader,
      },
      {
        path: "profile",
        element: <TraineeProfile />,
        loader: authLoader,
      },
      {
        path: "edit-details",
        element: <EditDetails />,
        loader: onboardingSummaryLoader,
      },
    ],
  },
], { basename: import.meta.env.VITE_BASE_PATH });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
            <NotificationProvider>
              <div className="min-h-screen bg-gray-50 transition-colors">
                <RouterProvider router={router} />
                <ToastContainer />
              </div>
            </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
