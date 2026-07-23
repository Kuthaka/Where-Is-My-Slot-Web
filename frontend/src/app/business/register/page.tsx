"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, ArrowRight, Building2, MapPin, Car, UploadCloud,
  ChevronRight, ChevronLeft, Check, Clock, KeyRound, Eye, EyeOff, FileText, Phone, CreditCard, ShieldCheck
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import {
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema
} from "@/validations/business/onboarding.schema";
import { ChevronDown } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import CascadingLocation from "@/components/CascadingLocation";
import TimingsPicker, { TimingsData } from "@/components/TimingsPicker";
import ImageUploadWithCrop from "@/components/ImageUploadWithCrop";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function BusinessRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Core
    name: "",
    tagline: "",
    primaryCategory: "",
    subCategories: [] as string[],
    description: "",
    establishedYear: new Date().getFullYear(),
    password: "",

    // Step 2: Contact
    phone: "",
    whatsappNumber: "",
    contactPerson: "",
    websiteUrl: "",

    // Step 3: Location
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    latitude: 20.5937,
    longitude: 78.9629,

    // Step 4: Timings
    timings: {} as Record<string, unknown>,

    // Step 5: Facilities
    amenities: [] as string[],
    parking: { available: false, slots: 0, valet: false },
    petPolicy: "Not Allowed",
    seating: [] as string[],
    paymentModes: [] as string[],

    // Step 6: Catalogs
    services: [] as Record<string, unknown>[],
    products: [] as Record<string, unknown>[],
    menus: [] as string[],

    // Step 7: Media & Legal
    images: [] as string[],
    videos: [] as string[],
    logo: "",
    coverPhoto: "",
    gstNumber: "",
    businessRegistrationProof: "",
    ownerIdProof: "",
  });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const draft = sessionStorage.getItem("businessDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.formData) {
          // Merge to ensure no undefined fields override our defaults
          setFormData(prev => ({ ...prev, ...parsed.formData }));
        }
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

  const handleArrayToggle = (field: "amenities" | "paymentModes" | "seating", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
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
      if (!res.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent to your email!", { id: toastId });
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
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
      if (!res.ok) throw new Error("Invalid OTP");
      toast.success("Email verified!", { id: toastId });
      setShowOtpModal(false);
      setStep(1);
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    try {
      if (step === 1) {
        step1Schema.parse(formData);
        if (formData.password.length < 6) throw new Error("Password must be at least 6 characters");
      }
      if (step === 2) step2Schema.parse(formData);
      if (step === 3) step3Schema.parse(formData);
      if (step === 4) step4Schema.parse(formData);
      if (step === 5) step5Schema.parse(formData);
      if (step === 6) step6Schema.parse(formData);
      
      setStep((prev) => Math.min(prev + 1, 7));
    } catch (error: any) {
      if (error.issues && error.issues.length > 0) {
        toast.error(error.issues[0].message);
      } else if (error.errors && error.errors.length > 0) {
        toast.error(error.errors[0].message);
      } else {
        // Prevent raw JSON from leaking into the toast
        try {
          const parsed = JSON.parse(error.message);
          toast.error(Array.isArray(parsed) ? parsed[0].message : error.message);
        } catch {
          toast.error(error.message);
        }
      }
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      step7Schema.parse(formData);
    } catch (error: any) {
      if (error.issues && error.issues.length > 0) {
        toast.error(error.issues[0].message);
      } else if (error.errors && error.errors.length > 0) {
        toast.error(error.errors[0].message);
      } else {
        try {
          const parsed = JSON.parse(error.message);
          toast.error(Array.isArray(parsed) ? parsed[0].message : "Validation failed");
        } catch {
          toast.error("Validation failed");
        }
      }
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Registering your business...");
    try {
      const res = await fetch("http://localhost:5000/api/v1/businesses/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message?.message || err.message || "Failed to register business");
      }

      const responseData = await res.json();
      if (responseData.data?.accessToken) {
        const token = responseData.data.accessToken;
        localStorage.setItem("token", token);
        localStorage.setItem("businessToken", token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`;
        document.cookie = `businessToken=${token}; path=/; max-age=604800; SameSite=Strict`;
      }

      toast.success("Business registered successfully! 🎉", { id: toastId });
      sessionStorage.removeItem("businessDraft");
      router.push("/business/register/success");
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const sidebarSteps = [
    { id: 1, label: "Identity", icon: Building2 },
    { id: 2, label: "Contact Info", icon: Phone },
    { id: 3, label: "Location", icon: MapPin },
    { id: 4, label: "Timings", icon: Clock },
    { id: 5, label: "Facilities & Parking", icon: Car },
    { id: 6, label: "Services & Menus", icon: FileText },
    { id: 7, label: "Media & Legal", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Header />

      {step === 0 && (
        <main className="relative w-full flex-1 flex" style={{ backgroundImage: "url('/banners/bg-banner.png')", backgroundSize: "80% 100%", backgroundPosition: "right center", backgroundRepeat: "no-repeat" }}>
          {/* OTP Modal UI (same as before) */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#242424] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                <div className="flex justify-center mb-6"><div className="bg-yellow-100 dark:bg-yellow-400/20 p-3 rounded-full text-yellow-600 dark:text-yellow-400"><Mail size={32} /></div></div>
                <h3 className="text-2xl font-black text-center mb-2">Check your email</h3>
                <p className="text-gray-500 text-center text-sm mb-6">We've sent a code to <strong>{email}</strong></p>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full text-center tracking-[0.5em] text-3xl font-black bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" placeholder="••••••" required />
                  <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3 px-4 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors disabled:opacity-50">{loading ? "Verifying..." : "Verify & Continue"}</button>
                </form>
              </div>
            </div>
          )}

          <div className="max-w-[1440px] mx-auto w-full flex items-center pt-[96px] pb-12 px-4 lg:px-8">
            <div className="w-full max-w-md bg-white/95 dark:bg-[#242424]/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative z-10">
              <div className="flex flex-col items-center">
                <img src="/icons/business-001.png" alt="Business" className="w-20 h-20 object-contain mb-4 drop-shadow-sm dark:brightness-200" />
                <h2 className="text-3xl font-extrabold text-center">List Your Business</h2>
                <p className="mt-2 text-center text-sm font-bold text-gray-500">Enter your business email to get started.</p>
              </div>
              <form onSubmit={handleEmailContinue} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Business Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 border border-gray-200 dark:border-gray-700 rounded-xl py-3 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="you@company.com" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-xl font-bold bg-yellow-400 text-black flex justify-center items-center gap-2 hover:bg-yellow-500 transition-colors">Continue <ArrowRight size={20}/></button>
              </form>
            </div>
          </div>
        </main>
      )}

      {step >= 1 && (
        <main className="flex-1 max-w-[1440px] mx-auto w-full flex items-center justify-center pt-[96px] pb-12 px-4 lg:px-8">
          <div className="max-w-5xl w-full bg-white dark:bg-[#242424] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar */}
            <div className="w-full md:w-1/3 bg-gray-900 dark:bg-[#111] p-8 text-white flex flex-col justify-between hidden md:flex">
              <div>
                <h2 className="text-3xl font-black mb-1">Partner with us</h2>
                <p className="text-gray-400 text-sm mb-10">Complete your profile in 7 steps.</p>
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
            </div>

            {/* Main Form Area */}
            <div className="flex-1 p-8 sm:p-12 overflow-y-auto max-h-[80vh]">
              
              {/* STEP 1: Core Identity */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Core Business Identity</h3>
                  <div>
                    <label className="block font-bold mb-2">Business Name *</label>
                    <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" placeholder="Legal or Trade Name" />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Tagline / Catchphrase</label>
                    <input name="tagline" value={formData.tagline || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" placeholder="e.g. Best Coffee in Town" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-2">Primary Category *</label>
                      <select name="primaryCategory" value={formData.primaryCategory || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                        <option value="">Select</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Retail">Retail</option>
                        <option value="Service">Service</option>
                        <option value="Health">Health / Clinic</option>
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block font-bold mb-2">Established Year</label>
                      <button 
                        type="button" 
                        onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                        className="w-full flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white"
                      >
                        {formData.establishedYear}
                        <ChevronDown size={18} className="text-gray-400" />
                      </button>
                      
                      {yearDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#242424] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <button
                              key={year}
                              type="button"
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-yellow-50 dark:hover:bg-[#333] ${formData.establishedYear === year ? 'font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-[#333]/50' : 'text-gray-700 dark:text-gray-300'}`}
                              onClick={() => {
                                setFormData({ ...formData, establishedYear: year });
                                setYearDropdownOpen(false);
                              }}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Detailed Description</label>
                    <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" placeholder="Brief history and specialties" />
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700 mt-6">
                    <label className="block font-bold mb-2">Set Dashboard Password *</label>
                    <div className="relative">
                      <input name="password" type={showPassword ? "text" : "password"} value={formData.password || ""} onChange={handleChange} className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-12" placeholder="Min 6 chars" />
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
              )}

              {/* STEP 2: Contact Info */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Extensive Contact Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-bold mb-2">Primary Phone *</label>
                      <PhoneInput 
                        value={formData.phone || ""} 
                        onChange={(val) => setFormData({ ...formData, phone: val })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">WhatsApp Number</label>
                      <PhoneInput 
                        value={formData.whatsappNumber || ""} 
                        onChange={(val) => setFormData({ ...formData, whatsappNumber: val })} 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Contact Person Name</label>
                      <input name="contactPerson" value={formData.contactPerson || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" placeholder="Manager/Owner Name" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Website URL</label>
                      <input name="websiteUrl" value={formData.websiteUrl || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" placeholder="https://" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Hyper-Local Location</h3>
                  
                  <CascadingLocation
                    country={formData.country || ""}
                    state={formData.state || ""}
                    city={formData.city || ""}
                    pincode={formData.pincode || ""}
                    address={formData.address || ""}
                    landmark={formData.landmark || ""}
                    onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
                  />

                  <div className="pt-4">
                    <label className="block font-bold mb-2">Pin on Map *</label>
                    <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapPicker 
                        position={{ lat: formData.latitude, lng: formData.longitude }} 
                        setPosition={(pos) => setFormData(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Timings */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Operational Hours</h3>
                  <TimingsPicker
                    value={(formData.timings as TimingsData) || {}}
                    onChange={(val) => setFormData((prev) => ({ ...prev, timings: val }))}
                  />
                </div>
              )}

              {/* STEP 5: Facilities & Parking */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Facilities, Parking & Payment</h3>
                  
                  {/* Smart Parking Integration */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/50 rounded-2xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><Car size={20}/> Smart Parking Integration</h4>
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                      <input type="checkbox" checked={formData.parking.available} onChange={(e) => setFormData(prev => ({ ...prev, parking: { ...prev.parking, available: e.target.checked } }))} className="w-5 h-5 accent-yellow-500" />
                      <span className="font-bold">We provide parking for customers</span>
                    </label>
                    {formData.parking.available && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-1">Total Slots</label>
                          <input type="number" min="0" value={formData.parking.slots} onChange={(e) => setFormData(prev => ({ ...prev, parking: { ...prev.parking, slots: parseInt(e.target.value) || 0 } }))} className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" />
                        </div>
                        <div className="flex items-end pb-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.parking.valet} onChange={(e) => setFormData(prev => ({ ...prev, parking: { ...prev.parking, valet: e.target.checked } }))} className="w-5 h-5 accent-yellow-500" />
                            <span className="font-bold">Valet Parking</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {["WiFi", "AC", "Wheelchair Accessible", "Smoking Zone"].map(amenity => (
                        <button key={amenity} type="button" onClick={() => handleArrayToggle("amenities", amenity)} className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.amenities.includes(amenity) ? "bg-yellow-400 text-black border-yellow-400" : "border-gray-200 dark:border-gray-700"}`}>
                          {formData.amenities.includes(amenity) ? `✓ ${amenity}` : amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3">Payment Modes Accepted</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Cash", "Credit/Debit Cards", "UPI / Google Pay", "Cheque"].map(mode => (
                        <button key={mode} type="button" onClick={() => handleArrayToggle("paymentModes", mode)} className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.paymentModes.includes(mode) ? "bg-yellow-400 text-black border-yellow-400" : "border-gray-200 dark:border-gray-700"}`}>
                          {formData.paymentModes.includes(mode) ? `✓ ${mode}` : mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Menus & Services */}
              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Catalogs & Services</h3>
                  <p className="text-sm text-gray-500">You can upload menu images or list top services here. You can also configure this later from the dashboard.</p>
                  
                  <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-[#1a1a1a]">
                    <p className="font-bold">Upload Menu/Brochure Images</p>
                    <p className="text-sm text-gray-500 mb-4">Upload scanned menus or service lists.</p>
                    <button type="button" className="bg-gray-200 dark:bg-gray-800 font-bold px-6 py-2 rounded-lg">Upload Files</button>
                  </div>
                </div>
              )}

              {/* STEP 7: Media & Legal */}
              {step === 7 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-2xl font-black mb-6">Media & Legal Verification</h3>
                  
                  <div className="space-y-8">
                    <ImageUploadWithCrop
                      type="cover"
                      label="Cover Photo (Banner)"
                      value={formData.coverPhoto as string}
                      onChange={(val) => setFormData(prev => ({ ...prev, coverPhoto: val }))}
                    />
                    
                    <ImageUploadWithCrop
                      type="logo"
                      label="Business Logo"
                      value={formData.logo as string}
                      onChange={(val) => setFormData(prev => ({ ...prev, logo: val }))}
                    />
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 mt-8">Legal Details (Backend verification only)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">GST/Tax Number</label>
                        <input name="gstNumber" value={formData.gstNumber || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Aadhar/PAN Number (Owner)</label>
                        <input name="ownerIdProof" value={formData.ownerIdProof || ""} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <button onClick={handleBack} disabled={loading} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <ChevronLeft size={18} /> Back
                </button>
                {step < 7 ? (
                  <button onClick={handleNext} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors">
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition-colors">
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
