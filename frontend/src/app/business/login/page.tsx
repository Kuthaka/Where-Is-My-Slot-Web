"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Mail, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "email">("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Invalid credentials");
      }
      localStorage.setItem("token", data.data.accessToken);
      document.cookie = `token=${data.data.accessToken}; path=/; max-age=604800; SameSite=Strict`;
      router.push("/business/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Bypassing OTP logic for smooth testing
      const res = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: "000000" }), // Mock OTP
      });
      if (!res.ok) throw new Error("Failed to authenticate");

      const data = await res.json();
      localStorage.setItem("token", data.data?.accessToken || data.accessToken);
      document.cookie = `token=${data.data?.accessToken || data.accessToken}; path=/; max-age=604800; SameSite=Strict`;

      router.push("/business/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start px-4 sm:px-12 lg:px-24"
      style={{
        backgroundImage: "url('/banner-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/40">
        <div className="flex flex-col items-center">
          <img src="/icons/business-001.png" alt="Business Icon" className="w-20 h-20 object-contain mb-4 drop-shadow-sm" />
          <h2 className="text-3xl font-extrabold text-[#2C5EAD] tracking-tight text-center">
            Merchant Login
          </h2>
          <p className="mt-2 text-center text-sm font-bold text-[#1591DC]/80">
            Access your business dashboard to manage slots and offers.
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={loginMethod === "password" ? handlePasswordLogin : handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#2C5EAD]">
                Business Email address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#1591DC]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#4BB8FA] focus:border-[#4BB8FA] block w-full pl-10 sm:text-sm border-[#C4E2F5] rounded-xl py-3 bg-white border outline-none transition-colors text-gray-900"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {loginMethod === "password" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label htmlFor="password" className="block text-sm font-bold text-[#2C5EAD]">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-[#1591DC]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-[#4BB8FA] focus:border-[#4BB8FA] block w-full pl-10 sm:text-sm border-[#C4E2F5] rounded-xl py-3 bg-white border outline-none transition-colors text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1591DC] hover:bg-[#2C5EAD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4BB8FA] transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : loginMethod === "password" ? "Login" : "Instant Login (No OTP)"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod(loginMethod === "password" ? "email" : "password");
                  setError("");
                }}
                className="text-sm font-bold text-[#4BB8FA] hover:text-[#1591DC] transition-colors"
              >
                {loginMethod === "password" ? "Instant Login (Bypass OTP) instead" : "Login with Password instead"}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/business/register" className="text-sm font-bold text-[#4BB8FA] hover:text-[#1591DC] transition-colors">
                Don&apos;t have a business listed? Create one.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
