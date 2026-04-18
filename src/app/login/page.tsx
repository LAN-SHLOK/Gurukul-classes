"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-white rounded-xl p-1 overflow-hidden">
              <img src="/logo.png" alt="Gurukul" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-white text-lg tracking-tighter">
              Gurukul<span className="text-[#2D31FA]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tighter">Welcome Back</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Sign in to your student account</p>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 space-y-4">

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/25">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Credentials form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 px-1">Email</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#2D31FA]/60 outline-none px-4 text-sm font-medium transition-all"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Password</label>
                <Link href="/reset-password" className="text-[9px] font-black uppercase tracking-widest text-[#2D31FA] hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#2D31FA]/60 outline-none px-4 text-sm font-medium transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(45,49,250,0.6)]"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn className="w-4 h-4" /> Sign In</>
              }
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-white/30">
          No account?{" "}
          <Link href="/register" className="font-black text-[#2D31FA] hover:text-white transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
