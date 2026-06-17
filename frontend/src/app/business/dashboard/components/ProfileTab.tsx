"use client";

import { CheckCircle2, MapPin, Phone, Mail, Globe, Clock, Info, Check } from "lucide-react";
import Link from "next/link";

export default function ProfileTab({ business }: { business: any }) {
  if (!business) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cover and Logo */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative">
        <div className="h-48 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
          {business.coverPhoto && <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
        </div>
        <div className="px-6 pb-6 pt-16 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-2xl border-4 border-white dark:border-[#242424] bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden flex items-center justify-center">
            {business.logo ? (
              <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-gray-300">Logo</span>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {business.name}
                {business.isVerified && <CheckCircle2 className="text-blue-500 w-6 h-6" fill="currentColor" stroke="white" />}
              </h1>
              <p className="text-gray-500 font-medium mt-1">{business.primaryCategory || "Uncategorized"} {business.subCategories?.length > 0 && `• ${business.subCategories.join(", ")}`}</p>
              {business.tagline && <p className="text-gray-800 dark:text-gray-300 italic mt-2">"{business.tagline}"</p>}
            </div>
            
            <Link 
              href="/business/dashboard/profile/edit"
              className="px-6 py-2.5 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors rounded-xl font-bold text-gray-900 dark:text-white"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="text-yellow-500" /> About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {business.description || "No description provided yet. Add a description to tell customers more about your business."}
            </p>
          </div>

          {/* Business Features */}
          <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Check className="text-yellow-500" /> Amenities & Features
            </h3>
            {business.amenities && business.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {business.amenities.map((amenity: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact & Location */}
          <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Contact & Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{business.phone || "Not provided"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{business.email || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                  <Globe size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Website</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{business.websiteUrl || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                    {business.address ? `${business.address}, ${business.city}, ${business.state}` : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="text-yellow-500" /> Working Hours
            </h3>
            
            {business.timings ? (
              <div className="space-y-3">
                {Object.entries(business.timings).map(([day, times]: [string, any]) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 capitalize">{day}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{times.open} - {times.close}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Hours not specified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
