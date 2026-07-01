import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react";
import api from "../api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/api/password/forgot-password", { email });
            setIsSuccess(true);
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
            </div>

            {/* Forgot Password Card */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="glass-panel rounded-2xl shadow-xl p-8 animate-fade-in border border-white/40 bg-white/80">
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-md flex items-center justify-center mb-5">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
                                <p className="mt-2 text-gray-500 text-sm">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`
                      block w-full px-4 py-2.5 rounded-lg border bg-white/70 backdrop-blur-sm
                      transition-all duration-200 outline-none text-sm font-medium text-gray-900 placeholder-gray-400
                      ${error
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400"
                                            }
                    `}
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center animate-fade-in shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
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
                                            Send Reset Link <Send className="ml-2 h-4 w-4" />
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
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Check Your Email</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                If this email exists in our system, you will receive a password reset link shortly.
                            </p>
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm mb-6">
                                <p className="font-medium">📧 Email sent to:</p>
                                <p className="text-blue-600">{email}</p>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">
                                Didn't receive the email? Check your spam folder or try again with a different email.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg
                  text-sm font-medium text-blue-600 border border-blue-200 
                  hover:bg-blue-50 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
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
