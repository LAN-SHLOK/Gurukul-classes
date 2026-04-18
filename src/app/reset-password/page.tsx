"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/password-reset/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send reset code");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50/50 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="p-10 shadow-2xl border-none ring-1 ring-gray-100">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#2D31FA] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">G</span>
              </div>
              <span className="font-black text-gray-900 text-xl">Gurukul<span className="text-[#2D31FA]">.</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 mt-1">Enter your email to receive a 6-digit code</p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Check your email</p>
                <p className="text-gray-500 text-sm mt-1">
                  If <strong>{email}</strong> is registered, you&apos;ll receive a reset code within a minute.
                </p>
              </div>
              <Link href="/verify-reset">
                <Button className="w-full h-12">Enter Verification Code</Button>
              </Link>
              <Link href="/login" className="block text-sm text-gray-500 hover:text-[#2D31FA] text-center">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" isLoading={loading} className="w-full h-12">
                Send Reset Code
              </Button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link href="/login" className="font-bold text-[#2D31FA] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
