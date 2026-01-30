import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { SignedOut, SignInButton } from "@clerk/clerk-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const result = await login(email, password);
        if (result.success) {
            navigate(`/${result.role}/dashboard`);
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-emerald-500 rounded-sm flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-200">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">AgencyFlow</h1>
                    <p className="text-slate-500 font-semibold tracking-tighter">Enter your credentials to access your workspace.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-10 rounded-sm border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Code</label>
                                <a href="#" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-sm shadow-lg shadow-emerald-200 flex items-center justify-center space-x-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 uppercase italic tracking-widest"
                        >
                            {isSubmitting ? "Authenticating..." : (
                                <>
                                    <span>Launch Workspace</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        New to AgencyFlow? <Link to="/register" className="text-emerald-600 hover:text-emerald-700">Get Started</Link>
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Or continue with</p>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full flex items-center justify-center space-x-3 py-3 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors group">
                                    <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">C</div>
                                    <span className="text-sm font-bold text-slate-700">Clerk Authentication</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
