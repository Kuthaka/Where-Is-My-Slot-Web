"use client";

import {
  CheckCircle2, MapPin, Phone, Mail, Globe, Clock, Info,
  Car, CreditCard, PawPrint, Users, CalendarCheck,
  ExternalLink, Building2, Globe2, Share2, AtSign,
  Sparkles, MessageCircle, ShieldCheck, Edit3
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

// ─── Utility: ContactRow ─────────────────────────────────────────────────────
function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block">
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
        )}
      </div>
    </div>
  );
}

// ─── Utility: InfoCard ───────────────────────────────────────────────────────
function InfoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ─── Utility: SectionHeader ──────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-500">
        {icon}
      </div>
      <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProfileTab({ business }: { business: any }) {
  if (!business) return null;

  const openToday = (() => {
    if (!business.timings) return null;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const t = business.timings[today];
    if (!t || t.closed) return null;
    return `${t.open} – ${t.close}`;
  })();

  const socialIcons: Record<string, React.ReactNode> = {
    instagram: <AtSign size={16} />,
    facebook: <Share2 size={16} />,
    twitter: <Globe2 size={16} />,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Hero Card: Cover + Logo + Identity ───────────────────────────── */}
      <InfoCard>
        {/* Cover Banner */}
        <div className="relative h-52 sm:h-64 w-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 overflow-hidden">
          {business.coverPhoto && (
            <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          )}
          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
              business.status === "APPROVED"
                ? "bg-green-500 text-white"
                : business.status === "REJECTED"
                ? "bg-red-500 text-white"
                : "bg-yellow-400 text-black"
            }`}>
              {business.status === "APPROVED" ? "✓ Live" : business.status === "REJECTED" ? "Rejected" : "⏳ Pending Approval"}
            </span>
          </div>
        </div>

        {/* Logo + Name row */}
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4 relative z-10">
            {/* Logo */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl border-4 border-white dark:border-[#242424] bg-white dark:bg-[#1a1a1a] shadow-xl overflow-hidden flex items-center justify-center shrink-0">
              {business.logo ? (
                <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} className="text-gray-300 dark:text-gray-600" />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pb-0">
              <Link
                href="/business/dashboard/profile/edit"
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                <Edit3 size={15} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Business Identity */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {business.name}
              </h1>
              {business.isVerified && (
                <CheckCircle2 className="text-blue-500 w-6 h-6 shrink-0" fill="currentColor" stroke="white" />
              )}
            </div>

            {/* Category + Sub */}
            <div className="flex flex-wrap gap-2">
              {business.primaryCategory && (
                <span className="px-3 py-1 bg-yellow-400/15 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                  {business.primaryCategory}
                </span>
              )}
              {business.subCategories?.map((sub: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-700">
                  {sub}
                </span>
              ))}
            </div>

            {/* Tagline */}
            {business.tagline && (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm leading-relaxed">
                "{business.tagline}"
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-500">
              {business.establishedYear && (
                <span className="flex items-center gap-1.5"><CalendarCheck size={14} className="text-yellow-500" /> Est. {business.establishedYear}</span>
              )}
              {openToday && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
                  <Clock size={14} /> Open today: {openToday}
                </span>
              )}
              {business.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-yellow-500" /> {business.city}{business.state ? `, ${business.state}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </InfoCard>

      {/* ── Main Body: 3-column grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left / Main Column (2 cols wide) ──────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* About */}
          <InfoCard className="p-6">
            <SectionHeader icon={<Info size={16} />} title="About" />
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {business.description || "No description provided yet. Click Edit Profile to tell customers about your business."}
            </p>
          </InfoCard>

          {/* Amenities */}
          {business.amenities?.length > 0 && (
            <InfoCard className="p-6">
              <SectionHeader icon={<Sparkles size={16} />} title="Amenities & Features" />
              <div className="flex flex-wrap gap-2">
                {business.amenities.map((a: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Sparkles size={12} className="text-yellow-400" /> {a}
                  </span>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Payment & Seating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {business.paymentModes?.length > 0 && (
              <InfoCard className="p-6">
                <SectionHeader icon={<CreditCard size={16} />} title="Payment Modes" />
                <div className="flex flex-wrap gap-2">
                  {business.paymentModes.map((pm: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold">
                      {pm}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}

            {business.seating?.length > 0 && (
              <InfoCard className="p-6">
                <SectionHeader icon={<Users size={16} />} title="Seating Options" />
                <div className="flex flex-wrap gap-2">
                  {business.seating.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>

          {/* Parking */}
          {business.parking?.available && (
            <InfoCard className="p-6">
              <SectionHeader icon={<Car size={16} />} title="Parking" />
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Parking Available
                  {business.parking.slots > 0 && ` (${business.parking.slots} slots)`}
                </div>
                {business.parking.valet && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Valet Service
                  </div>
                )}
              </div>
            </InfoCard>
          )}

          {/* Map */}
          {business.latitude && business.longitude && (
            <InfoCard className="p-6">
              <SectionHeader icon={<MapPin size={16} />} title="Location on Map" />
              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative z-0">
                <MapPicker
                  position={{ lat: business.latitude, lng: business.longitude }}
                  readonly={true}
                />
              </div>
              {business.address && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-start gap-2">
                  <MapPin size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                  {[business.address, business.landmark, business.city, business.state, business.pincode, business.country]
                    .filter(Boolean).join(", ")}
                </p>
              )}
            </InfoCard>
          )}
        </div>

        {/* ── Right / Sidebar Column ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Contact Info */}
          <InfoCard className="p-6">
            <SectionHeader icon={<Phone size={16} />} title="Contact Info" />
            <div>
              {business.phone && <ContactRow icon={<Phone size={15} />} label="Primary Phone" value={business.phone} href={`tel:${business.phone}`} />}
              {business.whatsappNumber && <ContactRow icon={<MessageCircle size={15} />} label="WhatsApp" value={business.whatsappNumber} href={`https://wa.me/${business.whatsappNumber}`} />}
              {business.email && <ContactRow icon={<Mail size={15} />} label="Email" value={business.email} href={`mailto:${business.email}`} />}
              {business.websiteUrl && <ContactRow icon={<Globe size={15} />} label="Website" value={business.websiteUrl} href={business.websiteUrl} />}
              {!business.phone && !business.email && !business.websiteUrl && (
                <p className="text-sm text-gray-500 italic">No contact info provided.</p>
              )}
            </div>
          </InfoCard>

          {/* Social Links */}
          {business.socialLinks && Object.keys(business.socialLinks).some(k => business.socialLinks[k]) && (
            <InfoCard className="p-6">
              <SectionHeader icon={<Globe size={16} />} title="Social Media" />
              <div className="space-y-3">
                {Object.entries(business.socialLinks).map(([platform, url]: [string, any]) =>
                  url ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-yellow-400/20 group-hover:text-yellow-600 transition-colors">
                        {socialIcons[platform.toLowerCase()] || <Globe size={16} />}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {platform}
                      </span>
                      <ExternalLink size={12} className="ml-auto text-gray-400 group-hover:text-yellow-500 transition-colors" />
                    </a>
                  ) : null
                )}
              </div>
            </InfoCard>
          )}

          {/* Working Hours */}
          <InfoCard className="p-6">
            <SectionHeader icon={<Clock size={16} />} title="Working Hours" />
            {business.timings && Object.keys(business.timings).length > 0 ? (
              <div className="space-y-1">
                {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(day => {
                  const t = business.timings[day];
                  if (!t) return null;
                  const todayKey = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
                  const isToday = day === todayKey;
                  return (
                    <div key={day} className={`flex justify-between items-center py-2.5 px-3 rounded-xl text-sm ${isToday ? "bg-yellow-50 dark:bg-yellow-900/15 border border-yellow-200 dark:border-yellow-800/50" : ""}`}>
                      <span className={`font-bold capitalize ${isToday ? "text-yellow-700 dark:text-yellow-400" : "text-gray-500 dark:text-gray-400"}`}>
                        {isToday ? `${day.charAt(0).toUpperCase() + day.slice(1, 3)} ★` : day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </span>
                      {t.closed ? (
                        <span className="text-[11px] font-black text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                          Closed
                        </span>
                      ) : (
                        <span className={`font-semibold ${isToday ? "text-yellow-700 dark:text-yellow-400" : "text-gray-900 dark:text-white"}`}>
                          {t.open} – {t.close}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Hours not set.</p>
            )}
          </InfoCard>

          {/* Pet Policy */}
          {business.petPolicy && (
            <InfoCard className="p-6">
              <SectionHeader icon={<PawPrint size={16} />} title="Pet Policy" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{business.petPolicy}</p>
            </InfoCard>
          )}

          {/* Verification */}
          <InfoCard className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${business.isVerified ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-400"}`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Verification Status</p>
                <p className={`text-sm font-black ${business.isVerified ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {business.isVerified ? "✓ Verified Business" : "Pending Verification"}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
