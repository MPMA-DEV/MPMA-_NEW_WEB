import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { useFormValidation } from "../hooks/useFormValidation";
import { loginSchema, type LoginFormData } from "../lib/validations";

export default function Login() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginType, setLoginType] = useState<"trainee" | "staff">("trainee");

  const { isSubmitting, handleSubmit, getFieldError } =
    useFormValidation({
      schema: loginSchema,
      onSubmit: async (data: LoginFormData) => {
        setLoginError("");
        try {
          const success = await login(data.username, data.password, loginType);
          if (!success) {
            setLoginError("Login failed. Please check your credentials.");
          }
        } catch (error) {
          if (error instanceof Error) {
            setLoginError(error.message);
          } else {
            setLoginError("An unexpected error occurred");
          }
        }
      },
    });

  if (user) {
    if (loginType === "staff") {
      return <Navigate to="/staff" replace />;
    }
    if (!user.status || user.status === "Pending") {
      return <Navigate to="/onboarding" replace />;
    }
    if (user.status === "Processing") {
      return <Navigate to="/onboarding/summary" replace />;
    }
    if (user.status === "Active") {
      return <Navigate to="/trainee" replace />;
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setLoginError("Please fill in all required fields");
      return;
    }
    handleSubmit(formData);
  };

  const handleTypeSwitch = (type: "trainee" | "staff") => {
    setLoginType(type);
    setLoginError("");
    setFormData({ username: "", password: "" });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/ocean-bg.png")' }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[120px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="glass-panel rounded-2xl shadow-xl p-8 animate-fade-in border border-white/40 bg-white/80">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="mx-auto h-20 w-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-5 ring-1 ring-gray-100 p-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/1/1a/Sri_Lanka_Ports_Authority_logo.png"
                alt="SLPA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">SLPA OJT Portal</h2>
            <p className="mt-1 text-gray-500 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => handleTypeSwitch("trainee")}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold
                transition-all duration-200
                ${loginType === "trainee"
                  ? "bg-white text-blue-700 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <GraduationCap className="h-4 w-4" />
              Trainee
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch("staff")}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold
                transition-all duration-200
                ${loginType === "staff"
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <Briefcase className="h-4 w-4" />
              Staff
            </button>
          </div>

          {/* Role hint */}
          <p className="text-xs text-center text-gray-400 -mt-3 mb-5">
            {loginType === "trainee"
              ? "For OJT trainees and interns"
              : "For SLPA employees and supervisors"}
          </p>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                {loginType === "staff" ? "Staff ID / Username" : "Username"}
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                className={`
                  block w-full px-4 py-2.5 rounded-lg border bg-white/70 backdrop-blur-sm
                  transition-all duration-200 outline-none text-sm font-medium text-gray-900 placeholder-gray-400
                  ${getFieldError("username")
                    ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400"
                  }
                `}
                placeholder={
                  loginType === "staff"
                    ? "Enter your staff ID or username"
                    : "Enter your username"
                }
              />
              {getFieldError("username") && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
                  {getFieldError("username")}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className={`
                    block w-full px-4 py-2.5 pr-12 rounded-lg border bg-white/70 backdrop-blur-sm
                    transition-all duration-200 outline-none text-sm font-medium text-gray-900 placeholder-gray-400
                    ${getFieldError("password")
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400"
                    }
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
                  {getFieldError("password")}
                </p>
              )}
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center animate-fade-in shadow-sm">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2.5 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-indigo-600 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full flex justify-center items-center py-3 px-4 rounded-lg
                text-sm font-bold text-white
                ${loginType === "staff"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:ring-indigo-500"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500"
                }
                shadow-md hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-70 disabled:cursor-not-allowed
                transform transition-all duration-200 active:scale-95
              `}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as {loginType === "staff" ? "Staff" : "Trainee"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SLPA OJT Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}