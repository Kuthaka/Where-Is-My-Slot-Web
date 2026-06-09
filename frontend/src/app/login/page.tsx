"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send verification code");
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Invalid OTP");
      }
      
      localStorage.setItem("token", data.data.accessToken);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
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
        backgroundRepeat: "no-repeat"
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
          {!showOtp ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
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

              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1591DC] hover:bg-[#2C5EAD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4BB8FA] transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Login with Email"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/list-business" className="text-sm font-bold text-[#4BB8FA] hover:text-[#1591DC] transition-colors">
                  Don't have a business listed? Create one.
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-6">
                <ShieldCheck className="mx-auto h-12 w-12 text-[#4BB8FA] mb-3" />
                <h3 className="text-lg font-bold text-[#2C5EAD]">Enter Verification Code</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">We've sent a code to <span className="font-bold text-[#1591DC]">{email}</span></p>
              </div>
              
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="focus:ring-[#4BB8FA] focus:border-[#4BB8FA] block w-full sm:text-2xl text-center font-mono tracking-widest border-[#C4E2F5] rounded-xl py-3 bg-white border outline-none transition-colors text-gray-900"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1591DC] hover:bg-[#2C5EAD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4BB8FA] transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
              
              <div className="text-center">
                <button type="button" onClick={() => setShowOtp(false)} className="text-sm font-bold text-[#4BB8FA] hover:text-[#1591DC] transition-colors">
                  Change email address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
