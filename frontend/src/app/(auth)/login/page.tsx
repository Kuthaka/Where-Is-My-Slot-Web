"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
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
      router.push("/");
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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/banner-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/40">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-500">
            Sign in to your account to continue.
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Email address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-white border outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-white border outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>

            <div className="text-center mt-4 space-y-2">
              <Link href="/business/login" className="block text-sm font-bold text-[#1591DC] hover:text-[#2C5EAD] transition-colors">
                Are you a merchant? Login here →
              </Link>
              <Link href="/admin/login" className="block text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                Admin Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
