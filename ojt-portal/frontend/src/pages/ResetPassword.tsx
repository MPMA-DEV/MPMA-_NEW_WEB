import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import api from "../api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [tokenError, setTokenError] = useState("");

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setTokenError("No reset token provided");
                setIsValidating(false);
                return;
            }

            try {
                const response = await api.get(`/api/password/validate-token?token=${token}`);
                if (response.data.valid) {
                    setIsTokenValid(true);
                } else {
                    setTokenError(response.data.message || "Invalid token");
                }
            } catch (err: any) {
                setTokenError(err.response?.data?.message || "Invalid or expired reset link");
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Please enter a new password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/api/password/reset-password", {
                token,
                password,
            });
            setIsSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validating token state
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-float" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
                </div>
                <div className="relative z-10 w-full max-w-sm">
                    <div className="glass-panel rounded-2xl shadow-xl p-8 animate-fade-in border border-white/40 bg-white/80 text-center">
                        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!isTokenValid && tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-float" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
                </div>
                <div className="relative z-10 w-full max-w-sm">
                    <div className="glass-panel rounded-2xl shadow-xl p-8 animate-fade-in border border-white/40 bg-white/80 text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-md flex items-center justify-center mb-5">
                            <XCircle className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Invalid Reset Link</h2>
                        <p className="text-gray-500 text-sm mb-6">{tokenError}</p>
                        <div className="space-y-3">
                            <Link
                                to="/forgot-password"
                                className="block w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white 
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                  transition-all shadow-md hover:shadow-lg"
                            >
                                Request New Reset Link
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                    <p className="mt-6 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} SLPA OJT Portal. All rights reserved.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
            </div>

            {/* Reset Password Card */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="glass-panel rounded-2xl shadow-xl p-8 animate-fade-in border border-white/40 bg-white/80">
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-md flex items-center justify-center mb-5">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
                                <p className="mt-2 text-gray-500 text-sm">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">New Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`
                        block w-full px-4 py-2.5 pr-12 rounded-lg border bg-white/70 backdrop-blur-sm
                        transition-all duration-200 outline-none text-sm font-medium text-gray-900 placeholder-gray-400
                        ${error
                                                    ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400"
                                                }
                      `}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`
                        block w-full px-4 py-2.5 pr-12 rounded-lg border bg-white/70 backdrop-blur-sm
                        transition-all duration-200 outline-none text-sm font-medium text-gray-900 placeholder-gray-400
                        ${error || (confirmPassword && password !== confirmPassword)
                                                    ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400"
                                                }
                      `}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-red-500 font-medium ml-1 flex items-center">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center animate-fade-in shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || password !== confirmPassword}
                                    className="
                    w-full flex justify-center items-center py-3 px-4 rounded-lg
                    text-sm font-bold text-white 
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                    shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transform transition-all duration-200 active:scale-95
                  "
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Reset Password <Lock className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <Link
                                    to="/login"
                                    className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors mt-4"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Login
                                </Link>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md flex items-center justify-center mb-5 animate-bounce">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Password Reset!</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Your password has been successfully reset.
                            </p>
                            <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm mb-6">
                                <p>You will be redirected to the login page in a few seconds...</p>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg
                  text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                            >
                                Go to Login Now
                            </Link>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} SLPA OJT Portal. All rights reserved.
                </p>
            </div>
        </div>
    );
}
