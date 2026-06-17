"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking OTP verification for smooth testing
      const res = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: "000000" }),
      });
      if (!res.ok) throw new Error("Failed to authenticate");

      const data = await res.json();
      localStorage.setItem("token", data.data?.accessToken || data.accessToken);
      document.cookie = `token=${data.data?.accessToken || data.accessToken}; path=/; max-age=604800; SameSite=Strict`;
      toast.success("Authentication successful");
      router.push("/business/register/onboarding");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Header />
      <div className="relative w-full flex-1 mt-[72px] flex items-center justify-start px-4 sm:px-12 lg:px-24 pb-12">
        {/* Banner Image anchored to bottom */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[500px] sm:h-[600px] z-0"
          style={{
            backgroundImage: "url('/banners/bg-banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Gradient overlay to seamlessly blend the top of the image into the background */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#f0f2f5] dark:from-[#1a1a1a] to-transparent"></div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md bg-white/95 dark:bg-[#242424]/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative z-10 mt-8">
          <div className="flex flex-col items-center">
            <img src="/icons/business-001.png" alt="Business Icon" className="w-20 h-20 object-contain mb-4 drop-shadow-sm dark:brightness-200" />
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center">
              List Your Business
            </h2>
            <p className="mt-2 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
              Enter your business email to get started.
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Business Email address
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
                    className="focus:ring-yellow-400 focus:border-yellow-400 block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-700 rounded-xl py-3 bg-gray-50 dark:bg-[#1a1a1a] border outline-none transition-colors text-gray-900 dark:text-white"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Continue"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/business/login" className="text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-colors">
                  Already have an account? Log in here.
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
