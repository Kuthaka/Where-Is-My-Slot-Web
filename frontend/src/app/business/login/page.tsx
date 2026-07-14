"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Mail, ArrowRight, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Signing in...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/business-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Invalid credentials");
      }

      const token = data.data.accessToken;
      localStorage.setItem("token", token);
      localStorage.setItem("businessToken", token);
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`;
      document.cookie = `businessToken=${token}; path=/; max-age=604800; SameSite=Strict`;

      toast.success("Welcome back! 🎉", { id: toastId });
      window.location.href = "/business/dashboard";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Header />
      <main
        className="relative w-full flex-1 flex"
        style={{
          backgroundImage: "url('/banners/bg-banner.png')",
          backgroundSize: "80% 100%",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center pt-[96px] pb-12 px-4 lg:px-8">
          <div className="w-full max-w-md bg-white/95 dark:bg-[#242424]/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative z-10">
            <div className="flex flex-col items-center">
              <img src="/icons/business-001.png" alt="Business Icon" className="w-20 h-20 object-contain mb-4 drop-shadow-sm dark:brightness-200" />
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center">
                Merchant Login
              </h2>
              <p className="mt-2 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                Access your business dashboard to manage slots and offers.
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <label htmlFor="biz-email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Business Email
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="biz-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus:ring-yellow-400 focus:border-yellow-400 block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-700 rounded-xl py-3 bg-gray-50 dark:bg-[#1a1a1a] border outline-none transition-colors text-gray-900 dark:text-white"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="biz-password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="biz-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:ring-yellow-400 focus:border-yellow-400 block w-full pl-10 pr-12 sm:text-sm border-gray-200 dark:border-gray-700 rounded-xl py-3 bg-gray-50 dark:bg-[#1a1a1a] border outline-none transition-colors text-gray-900 dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Login to Dashboard"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>

                <div className="text-center space-y-3 pt-2">
                  <Link
                    href="/business/register"
                    className="block text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    Don&apos;t have a business listed? Register here →
                  </Link>
                  <Link
                    href="/login"
                    className="block text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Are you a regular user? Login here →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
