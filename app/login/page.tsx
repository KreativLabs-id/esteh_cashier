'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CupSoda, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-700 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8 border border-white/20">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <CupSoda size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Es Teh POS</h1>
                    <p className="text-secondary-500">Sign in to your account</p>
                </div>

                <form action={async (formData) => {
                    setLoading(true);
                    setError("");
                    const username = formData.get("username") as string;
                    const password = formData.get("password") as string;

                    try {
                        // Dynamically import signIn to use it in client component event handler
                        const { signIn } = await import("next-auth/react");
                        const res = await signIn("credentials", {
                            username,
                            password,
                            redirect: false,
                        });

                        if (res?.error) {
                            setError("Invalid credentials");
                            setLoading(false);
                        } else {
                            router.refresh();
                            router.push("/pos");
                        }
                    } catch (err) {
                        setError("An error occurred");
                        setLoading(false);
                    }
                }} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-700">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-secondary-50/50"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-secondary-50/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="text-center text-xs text-secondary-400">
                    &copy; 2024 Es Teh Franchise. All rights reserved.
                </div>
            </div>
        </div>
    );
}
