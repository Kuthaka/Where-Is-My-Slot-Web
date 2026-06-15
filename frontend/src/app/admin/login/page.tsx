"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
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

      const userData = data.data?.user || data.user;

      if (!userData || userData.role !== "SUPER_ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }

      const token = data.data?.accessToken || data.accessToken;
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`;
      toast.success("Welcome, Admin");
      router.push("/admin/dashboard");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 shadow-2xl rounded-3xl p-8 border border-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-500/30">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight text-center">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-400">
            Sign in to manage merchants and operations.
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300">
                Admin Email
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm rounded-xl py-3 bg-gray-900 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600"
                  placeholder="admin@localdial.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 sm:text-sm rounded-xl py-3 bg-gray-900 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Access Portal"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
