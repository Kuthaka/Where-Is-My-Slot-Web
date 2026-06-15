"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ArrowRight, KeyRound, UserPlus, Phone, CheckCircle2, XCircle, AtSign, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { toast } from "react-hot-toast";

export default function UserRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "username") setUsernameStatus("idle");
    if (e.target.name === "email") setEmailStatus("idle");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.username.length > 2) {
        setUsernameStatus("loading");
        try {
          const res = await fetch(`http://localhost:5000/api/v1/auth/check-availability?username=${formData.username}`);
          const data = await res.json();
          setUsernameStatus(data.data?.usernameAvailable ? "valid" : "invalid");
        } catch (e) {
          setUsernameStatus("invalid");
        }
      }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.username]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.email.includes("@") && formData.email.includes(".")) {
        setEmailStatus("loading");
        try {
          const res = await fetch(`http://localhost:5000/api/v1/auth/check-availability?email=${formData.email}`);
          const data = await res.json();
          setEmailStatus(data.data?.emailAvailable ? "valid" : "invalid");
        } catch (e) {
          setEmailStatus("invalid");
        }
      }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.email]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Registration failed");
      }
      toast.success("Account created successfully!");
      // Auto login after register (optional, or redirect to login)
      router.push("/login?registered=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex items-center justify-center pt-[72px] px-4 h-full overflow-y-auto no-scrollbar pb-8">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#242424] rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 my-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-400/10 text-yellow-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-yellow-400/20">
              <UserPlus size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center">
              Create Account
            </h2>
            <p className="mt-3 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
              Join to discover amazing local businesses.
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                    placeholder="localdialuser"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {usernameStatus === "loading" && <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>}
                    {usernameStatus === "valid" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {usernameStatus === "invalid" && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
                {usernameStatus === "invalid" && <p className="text-red-500 text-xs mt-1 ml-1 font-semibold">Username is not available</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {emailStatus === "loading" && <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>}
                    {emailStatus === "valid" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {emailStatus === "invalid" && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
                {emailStatus === "invalid" && <p className="text-red-500 text-xs mt-1 ml-1 font-semibold">Email is already registered</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || usernameStatus === "invalid" || usernameStatus === "loading" || emailStatus === "invalid" || emailStatus === "loading"}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-sm font-black text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all disabled:opacity-50 hover:scale-[1.02]"
                >
                  {loading ? "Creating account..." : "Register"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>

              <div className="text-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
