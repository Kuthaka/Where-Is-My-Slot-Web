"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Building2, Phone, Mail, Globe, MapPin,
  MessageCircle, Clock, Car, CreditCard, Users,
  PawPrint, Sparkles, AtSign, Share2, Globe2, Save, Check
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDashboard } from "../../layout";
import dynamic from "next/dynamic";
import ImageUploadWithCrop from "@/components/ImageUploadWithCrop";
import TimingsPicker, { TimingsData } from "@/components/TimingsPicker";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

// ─── Styled input helper ──────────────────────────────────────────────────────
const inputCls = "w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all text-gray-900 dark:text-white placeholder:text-gray-400";

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-500 shrink-0">
          {icon}
        </div>
        <h2 className="font-black text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">{children}</label>;
}

// Multi-chip toggle (for amenities, payment modes, seating)
function ChipGroup({ options, selected, onChange, color = "yellow" }: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  color?: "yellow" | "green" | "blue";
}) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-400 text-black ring-yellow-400",
    green: "bg-green-500 text-white ring-green-500",
    blue: "bg-blue-500 text-white ring-blue-500",
  };
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              active
                ? `${colorMap[color]} border-transparent shadow-sm`
                : "bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditProfilePage() {
  const router = useRouter();
  const { business, setBusiness } = useDashboard();
  const [loading, setLoading] = useState(false);

  // Form state — mirrors business model fields
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    websiteUrl: "",
    logo: "",
    coverPhoto: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    amenities: [] as string[],
    paymentModes: [] as string[],
    seating: [] as string[],
    timings: {} as TimingsData,
    parking: { available: false, slots: 0, valet: false },
    petPolicy: "",
    socialLinks: { instagram: "", facebook: "", twitter: "" },
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        tagline: business.tagline || "",
        description: business.description || "",
        phone: business.phone || "",
        whatsappNumber: business.whatsappNumber || "",
        email: business.email || "",
        websiteUrl: business.websiteUrl || "",
        logo: business.logo || "",
        coverPhoto: business.coverPhoto || "",
        address: business.address || "",
        landmark: business.landmark || "",
        city: business.city || "",
        state: business.state || "",
        country: business.country || "",
        pincode: business.pincode || "",
        amenities: business.amenities || [],
        paymentModes: business.paymentModes || [],
        seating: business.seating || [],
        timings: (business.timings as TimingsData) || {},
        parking: business.parking || { available: false, slots: 0, valet: false },
        petPolicy: business.petPolicy || "",
        socialLinks: business.socialLinks || { instagram: "", facebook: "", twitter: "" },
      });
      if (business.latitude && business.longitude) {
        setLocation({ lat: business.latitude, lng: business.longitude });
      }
    }
  }, [business]);

  const set = (field: string, val: any) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("businessToken");
      const payload = {
        ...form,
        latitude: location?.lat,
        longitude: location?.lng,
      };
      const res = await fetch(`http://localhost:5000/api/v1/businesses/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated!");
        setBusiness(data.data || data);
        router.push("/business/dashboard");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!business) return null;

  const AMENITIES = ["WiFi", "Air Conditioning", "Lift/Elevator", "CCTV", "Power Backup", "Wheelchair Access", "Rest Rooms", "Lockers", "Drinking Water", "Outdoor Seating"];
  const PAYMENT_MODES = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets", "EMI", "Cheque"];
  const SEATING_OPTIONS = ["Indoor", "Outdoor", "Rooftop", "Private Cabin", "Hall", "Counter"];
  const PET_POLICIES = ["Pets Allowed", "No Pets", "Pets on Leash Only"];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between mb-6 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-100 dark:bg-[#2a2a2a] rounded-xl hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-xs text-gray-500">Changes are saved to your live profile</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-black rounded-xl text-sm transition-colors shadow-sm"
        >
          {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">

        {/* ── Media: Cover + Logo ─────────────────────────────────────────── */}
        <SectionCard title="Media" icon={<Building2 size={16} />}>
          <ImageUploadWithCrop
            type="cover"
            label="Cover Photo (Banner)"
            value={form.coverPhoto}
            onChange={(val) => set("coverPhoto", val)}
          />
          <ImageUploadWithCrop
            type="logo"
            label="Business Logo"
            value={form.logo}
            onChange={(val) => set("logo", val)}
          />
        </SectionCard>

        {/* ── Identity ───────────────────────────────────────────────────── */}
        <SectionCard title="Business Identity" icon={<Sparkles size={16} />}>
          <div>
            <FieldLabel>Business Name *</FieldLabel>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel>Tagline / Catchphrase</FieldLabel>
            <input type="text" value={form.tagline} onChange={e => set("tagline", e.target.value)} placeholder="e.g. Best Coffee in Town" className={inputCls} />
          </div>
          <div>
            <FieldLabel>About / Description</FieldLabel>
            <textarea rows={5} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Tell customers what makes you special..." className={inputCls + " resize-none"} />
          </div>
        </SectionCard>

        {/* ── Contact Info ───────────────────────────────────────────────── */}
        <SectionCard title="Contact Info" icon={<Phone size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Primary Phone</FieldLabel>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <FieldLabel>WhatsApp Number</FieldLabel>
              <div className="relative">
                <MessageCircle size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.whatsappNumber} onChange={e => set("whatsappNumber", e.target.value)} className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <FieldLabel>Website URL</FieldLabel>
              <div className="relative">
                <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="url" value={form.websiteUrl} onChange={e => set("websiteUrl", e.target.value)} placeholder="https://" className={inputCls + " pl-10"} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Social Links ───────────────────────────────────────────────── */}
        <SectionCard title="Social Media Links" icon={<Globe2 size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <FieldLabel>Instagram</FieldLabel>
              <div className="relative">
                <AtSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="url" value={form.socialLinks.instagram} onChange={e => set("socialLinks", { ...form.socialLinks, instagram: e.target.value })} placeholder="https://instagram.com/..." className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <FieldLabel>Facebook</FieldLabel>
              <div className="relative">
                <Share2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="url" value={form.socialLinks.facebook} onChange={e => set("socialLinks", { ...form.socialLinks, facebook: e.target.value })} placeholder="https://facebook.com/..." className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <FieldLabel>Twitter / X</FieldLabel>
              <div className="relative">
                <Globe2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="url" value={form.socialLinks.twitter} onChange={e => set("socialLinks", { ...form.socialLinks, twitter: e.target.value })} placeholder="https://twitter.com/..." className={inputCls + " pl-10"} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Location ───────────────────────────────────────────────────── */}
        <SectionCard title="Location" icon={<MapPin size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <FieldLabel>Full Address</FieldLabel>
              <input type="text" value={form.address} onChange={e => set("address", e.target.value)} placeholder="Door No, Building, Street" className={inputCls} />
            </div>
            <div>
              <FieldLabel>Landmark</FieldLabel>
              <input type="text" value={form.landmark} onChange={e => set("landmark", e.target.value)} placeholder="Near..." className={inputCls} />
            </div>
            <div>
              <FieldLabel>Pincode</FieldLabel>
              <input type="text" value={form.pincode} onChange={e => set("pincode", e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <input type="text" value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel>State</FieldLabel>
              <input type="text" value={form.state} onChange={e => set("state", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel>Pin Exact Location on Map</FieldLabel>
            <div className="relative z-0 rounded-2xl overflow-hidden">
              <MapPicker position={location} setPosition={setLocation} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Search or click to drop your pin.</p>
          </div>
        </SectionCard>

        {/* ── Operational Hours ─────────────────────────────────────────── */}
        <SectionCard title="Operational Hours" icon={<Clock size={16} />}>
          <TimingsPicker
            value={form.timings}
            onChange={(val) => set("timings", val)}
          />
        </SectionCard>

        {/* ── Amenities ─────────────────────────────────────────────────── */}
        <SectionCard title="Amenities & Features" icon={<Sparkles size={16} />}>
          <ChipGroup options={AMENITIES} selected={form.amenities} onChange={val => set("amenities", val)} color="yellow" />
        </SectionCard>

        {/* ── Seating & Payment ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SectionCard title="Seating Options" icon={<Users size={16} />}>
            <ChipGroup options={SEATING_OPTIONS} selected={form.seating} onChange={val => set("seating", val)} color="blue" />
          </SectionCard>
          <SectionCard title="Payment Modes" icon={<CreditCard size={16} />}>
            <ChipGroup options={PAYMENT_MODES} selected={form.paymentModes} onChange={val => set("paymentModes", val)} color="green" />
          </SectionCard>
        </div>

        {/* ── Parking & Pet Policy ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SectionCard title="Parking" icon={<Car size={16} />}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set("parking", { ...form.parking, available: !form.parking.available })}
                className={`w-12 h-6 rounded-full relative transition-colors ${form.parking.available ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.parking.available ? "left-6" : "left-0.5"}`} />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Parking Available</span>
            </label>
            {form.parking.available && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <FieldLabel>Number of Slots</FieldLabel>
                  <input type="number" min="0" value={form.parking.slots} onChange={e => set("parking", { ...form.parking, slots: +e.target.value })} className={inputCls} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("parking", { ...form.parking, valet: !form.parking.valet })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${form.parking.valet ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.parking.valet ? "left-6" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Valet Parking</span>
                </label>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Pet Policy" icon={<PawPrint size={16} />}>
            <div className="space-y-2">
              {PET_POLICIES.map(p => (
                <label key={p} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors">
                  <div
                    onClick={() => set("petPolicy", p)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.petPolicy === p ? "bg-yellow-400 border-yellow-400" : "border-gray-300 dark:border-gray-600"}`}
                  >
                    {form.petPolicy === p && <Check size={11} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{p}</span>
                </label>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Save Footer ───────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-colors shadow-md disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
