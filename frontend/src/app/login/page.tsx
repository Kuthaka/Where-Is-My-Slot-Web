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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200 shadow-sm">
          <Store className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Merchant Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your business dashboard to manage slots and offers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {!showOtp ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
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
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-gray-50 border outline-none transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-600/30 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Login with Email"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/list-business" className="text-sm font-bold text-purple-600 hover:text-purple-500">
                  Don't have a business listed? Create one.
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-6">
                <ShieldCheck className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Enter Verification Code</h3>
                <p className="text-sm text-gray-500 mt-1">We've sent a code to <span className="font-bold text-gray-900">{email}</span></p>
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
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-2xl text-center font-mono tracking-widest border-gray-300 rounded-xl py-3 bg-gray-50 border outline-none transition-colors"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
              
              <div className="text-center">
                <button type="button" onClick={() => setShowOtp(false)} className="text-sm font-bold text-purple-600 hover:text-purple-500">
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
