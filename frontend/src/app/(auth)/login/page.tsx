"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ArrowRight, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { toast } from "react-hot-toast";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      toast.success("Successfully logged in!");
      // Force hard navigation to reload components that check token on mount
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex items-center justify-center pt-[72px] px-4 h-full overflow-y-auto no-scrollbar pb-8">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#242424] rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-400/10 text-yellow-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-yellow-400/20">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center">
              Welcome Back
            </h2>
            <p className="mt-3 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
              Sign in to your account to continue.
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-sm font-black text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all disabled:opacity-50 hover:scale-[1.02]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>

              <div className="text-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                    Register here
                  </Link>
                </p>
                <Link href="/business/login" className="block text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">
                  Are you a merchant? Login here →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
