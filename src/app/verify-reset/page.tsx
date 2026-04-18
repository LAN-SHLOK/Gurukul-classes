"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyResetPage() {
  const router = useRouter();
  const [step, setStep] = useState<"verify" | "newpass">("verify");
  const [formData, setFormData] = useState({ email: "", code: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.code.trim()) {
      setError("Email and code are required");
      return;
    }

    // Move to password step — full verify happens on final submit
    setStep("newpass");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:       formData.email.trim(),
          code:        formData.code.trim(),
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        if (data.message?.includes("code")) setStep("verify"); // back to code entry
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

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
            <h1 className="text-2xl font-bold text-gray-900">
              {success ? "Password Reset!" : step === "verify" ? "Verify Code" : "Set New Password"}
            </h1>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">Password updated successfully. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {step === "verify" ? (
                <form onSubmit={handleVerify} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />
                  <Input
                    label="Verification Code"
                    placeholder="6-digit code from email"
                    value={formData.code}
                    onChange={(e) => update("code", e.target.value)}
                    required
                    maxLength={6}
                  />
                  <Button type="submit" className="w-full h-12">Continue</Button>
                  <p className="text-center text-sm text-gray-500">
                    Didn&apos;t get a code?{" "}
                    <Link href="/reset-password" className="font-bold text-[#2D31FA] hover:underline">
                      Resend
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.newPassword}
                    onChange={(e) => update("newPassword", e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                  />
                  <Button type="submit" isLoading={loading} className="w-full h-12">
                    Reset Password
                  </Button>
                </form>
              )}
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
