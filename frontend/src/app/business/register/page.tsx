"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, ArrowRight, Building2, MapPin, Car, UploadCloud,
  ChevronRight, ChevronLeft, Check, Clock, KeyRound, Eye, EyeOff,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import { useModal } from "@/components/ModalProvider";

const TOTAL_STEPS = 5; // 0=email, 1=basics, 2=location, 3=details, 4=media

export default function BusinessRegisterPage() {
  const router = useRouter();
  const { showModal } = useModal();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Step 0
  const [email, setEmail] = useState("");

  // Steps 1-4 form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    primaryCategory: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    parking: { available: false, slots: 0, valet: false },
    images: [] as string[],
    amenities: [] as string[],
  });

  // Draft saving & restoring
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const draft = sessionStorage.getItem("businessDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {
        console.error("Error parsing draft", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem("businessDraft", JSON.stringify({ email, formData, step }));
    }
  }, [email, formData, step, isClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 0 → OTP
  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/business-auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message?.message || err.message || "Failed to send OTP");
      }
      toast.success("OTP sent to your email!", { id: toastId });
      setShowOtpModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    const toastId = toast.loading("Resending OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/business-auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message?.message || err.message || "Failed to resend OTP");
      }
      toast.success("OTP resent successfully!", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg, { id: toastId });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/business-auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message?.message || err.message || "Invalid OTP");
      }
      const responseData = await res.json();
      if (responseData.data?.verifiedToken) {
        sessionStorage.setItem("businessVerifiedToken", responseData.data.verifiedToken);
      }
      toast.success("Email verified!", { id: toastId });
      setShowOtpModal(false);
      setStep(1); // Proceed to next step
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        toast.error("Please fill in Business Name and Phone number.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.address || !formData.city || !formData.state) {
        toast.error("Please fill in Address, City and State.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.password || formData.password.length < 6) {
        toast.error("Please set a password with at least 6 characters.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    const toastId = toast.loading("Registering your business...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/businesses/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email,
          mobileNumbers: [formData.phone],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message?.message || err.message || "Failed to register business");
      }

      const responseData = await res.json();
      if (responseData.data?.accessToken) {
        const token = responseData.data.accessToken;
        localStorage.setItem("businessToken", token);
        document.cookie = `businessToken=${token}; path=/; max-age=604800; SameSite=Strict`;
      }

      toast.success("Business registered successfully! 🎉", { id: toastId });
      sessionStorage.removeItem("businessDraft");
      sessionStorage.removeItem("businessVerifiedToken");
      router.push("/business/register/success");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "An error occurred";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/businesses/upload-image", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, images: [...prev.images, data.data.url] }));
      toast.success("Image uploaded!", { id: toastId });
    } catch {
      toast.error("Could not upload image. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const sidebarSteps = [
    { id: 1, label: "Basics", icon: Building2 },
    { id: 2, label: "Location", icon: MapPin },
    { id: 3, label: "Details & Parking", icon: Car },
    { id: 4, label: "Media", icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Header />

      {/* ─── STEP 0 : Email Entry ─────────────────────────────── */}
      {step === 0 && (
        <main
          className="relative w-full flex-1 flex"
          style={{
            backgroundImage: "url('/banners/bg-banner.png')",
            backgroundSize: "80% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#242424] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
                <div className="flex justify-center mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-400/20 p-3 rounded-full text-yellow-600 dark:text-yellow-400">
                    <Mail size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-center mb-2">Check your email</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
                  We've sent a 6-digit verification code to <strong>{email}</strong>
                </p>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-[0.5em] text-3xl font-black bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white"
                      placeholder="••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
                  >
                    Didn't receive it? Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-[1440px] mx-auto w-full flex items-center pt-[96px] pb-12 px-4 lg:px-8">
            <div className="w-full max-w-md bg-white/95 dark:bg-[#242424]/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative z-10">
              <div className="flex flex-col items-center">
                <img src="/icons/business-001.png" alt="Business" className="w-20 h-20 object-contain mb-4 drop-shadow-sm dark:brightness-200" />
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center">List Your Business</h2>
                <p className="mt-2 text-center text-sm font-bold text-gray-500 dark:text-gray-400">Enter your business email to get started.</p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleEmailContinue} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Business Email address</label>
                    <div className="mt-2 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email" type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:ring-yellow-400 focus:border-yellow-400 block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-700 rounded-xl py-3 bg-gray-50 dark:bg-[#1a1a1a] border outline-none transition-colors text-gray-900 dark:text-white"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none transition-colors"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <div className="text-center">
                    <Link href="/business/login" className="text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-colors">
                      Already have an account? Log in here.
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ─── STEPS 1–4 : Onboarding Form ─────────────────────── */}
      {step >= 1 && (
        <main className="flex-1 max-w-[1440px] mx-auto w-full flex items-center justify-center pt-[96px] pb-12 px-4 lg:px-8">
          <div className="max-w-4xl w-full bg-white dark:bg-[#242424] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar */}
            <div className="w-full md:w-1/3 bg-gray-900 dark:bg-[#111] p-8 text-white flex flex-col justify-between">
              <div>
                <div className="mb-10">
                  <h2 className="text-3xl font-black mb-1">Partner with us</h2>
                  <p className="text-gray-400 text-sm">Complete your business profile in 4 steps.</p>
                  <p className="text-yellow-400 text-xs font-bold mt-2 truncate">{email}</p>
                </div>
                <div className="space-y-6">
                  {sidebarSteps.map((s) => {
                    const Icon = s.icon;
                    const isActive = step === s.id;
                    const isPassed = step > s.id;
                    return (
                      <div key={s.id} className={`flex items-center gap-4 ${isActive ? "opacity-100" : isPassed ? "opacity-70" : "opacity-40"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : isPassed ? "bg-yellow-400 text-black" : "bg-white/10 text-white"}`}>
                          {isPassed ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Step {s.id}</p>
                          <p className="font-bold">{s.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="hidden md:block mt-12 bg-white/10 p-6 rounded-2xl">
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-400">Contact our merchant support at support@whereismyslot.com</p>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 sm:p-12">

              {/* Step 1 – Basics */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Tell us about your business</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Business Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="e.g. The Grand Cafe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Phone *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Category</label>
                      <select name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white">
                        <option value="">Select a category</option>
                        <option value="Restaurant">Restaurant &amp; Cafe</option>
                        <option value="Retail">Retail &amp; Shopping</option>
                        <option value="Service">Professional Service</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="What makes your business special?" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 – Location */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Where are you located?</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="Building, Street, Landmark" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City *</label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="Mumbai" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">State *</label>
                        <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="Maharashtra" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                      <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white" placeholder="400001" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 – Details & Parking */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Details &amp; Parking</h3>
                  <div className="space-y-8">
                    <div className="bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-100 dark:bg-yellow-400/20 p-2 rounded-lg text-yellow-600 dark:text-yellow-400"><Car size={20} /></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Smart Parking Discovery</h4>
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-yellow-400 transition-colors">
                          <input type="checkbox" checked={formData.parking.available} onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, available: e.target.checked } })} className="w-5 h-5 text-yellow-500 rounded border-gray-300 focus:ring-yellow-400" />
                          <span className="font-bold text-gray-700 dark:text-gray-300">We provide parking for customers</span>
                        </label>
                        {formData.parking.available && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Available Slots</label>
                              <input type="number" min="0" value={formData.parking.slots} onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, slots: parseInt(e.target.value) || 0 } })} className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white" />
                            </div>
                            <div className="flex items-end pb-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.parking.valet} onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, valet: e.target.checked } })} className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-400" />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Valet Parking</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Clock size={18} className="text-gray-400" /> Operating Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {["WiFi", "Air Conditioning", "Wheelchair Accessible", "Card Payment", "Pet Friendly"].map((amenity) => {
                          const isSelected = formData.amenities.includes(amenity);
                          return (
                            <button key={amenity} type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, amenities: isSelected ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity] }))}
                              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isSelected ? "bg-yellow-400 text-black shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                            >
                              {isSelected ? `✓ ${amenity}` : amenity}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Set Password */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-600 dark:text-gray-400"><KeyRound size={20} /></div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">Set Dashboard Password *</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">You'll use this to log in to your merchant dashboard.</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white"
                          placeholder="Min. 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 – Media */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Upload Media</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Upload photos of your storefront, menu, or interior to attract more customers.</p>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-white dark:bg-[#242424] p-4 rounded-full shadow-sm mb-4">
                      <UploadCloud size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Click to upload images</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
                    <label htmlFor="imageUpload" className="bg-gray-900 dark:bg-yellow-400 hover:bg-black dark:hover:bg-yellow-500 text-white dark:text-black px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-md">
                      {loading ? "Uploading..." : "Browse Files"}
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Uploaded Images</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 aspect-video">
                            <img src={img} alt="Business upload" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={18} /> Back
                </button>

                {step < 4 ? (
                  <button onClick={handleNext} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/30 transition-all">
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Submitting..." : "Submit for Approval"} <Check size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
