"use client";

import { Car, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ParkingTab({ business }: { business: any }) {
  const [availableSlots, setAvailableSlots] = useState(business?.parking?.slots || 0);

  if (!business) return null;
  const parkingInfo = business.parking || { available: false, slots: 0, valet: false };

  if (!parkingInfo.available) {
    return (
      <div className="bg-white dark:bg-[#242424] p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-gray-100 dark:bg-[#1a1a1a] p-5 rounded-full text-gray-400 mb-6">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Parking Not Configured</h3>
        <p className="text-gray-500 max-w-sm mb-6">You haven't enabled parking services for your business. Update your profile settings to enable parking discovery.</p>
        <button className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black shadow-sm">
          Configure Parking Settings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Smart Parking Management</h2>
          <p className="text-gray-500 font-medium mt-1">Update your live parking availability for customers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Live Availability Control */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#2C5EAD] to-[#1591DC] p-8 rounded-[32px] shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Car size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold tracking-wider uppercase text-blue-100">Live Status</span>
            </div>
            
            <h3 className="text-5xl font-black mb-2">{availableSlots} <span className="text-2xl text-blue-200">/ {parkingInfo.slots}</span></h3>
            <p className="text-blue-100 font-medium mb-8">Slots currently available for customers</p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setAvailableSlots(Math.max(0, availableSlots - 1))}
                className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center text-2xl font-black transition-colors backdrop-blur-sm"
              >
                -
              </button>
              <button 
                onClick={() => setAvailableSlots(Math.min(parkingInfo.slots, availableSlots + 1))}
                className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center text-2xl font-black transition-colors backdrop-blur-sm"
              >
                +
              </button>
              
              <button className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-colors ml-auto flex items-center gap-2">
                <RefreshCw size={18} /> Update Live feed
              </button>
            </div>
          </div>
        </div>

        {/* Parking Details */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-6">Configuration</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Total Capacity</span>
                <span className="font-bold text-gray-900 dark:text-white">{parkingInfo.slots} Vehicles</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Valet Parking</span>
                <span className={`font-bold ${parkingInfo.valet ? 'text-green-500' : 'text-gray-400'}`}>
                  {parkingInfo.valet ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Pricing</span>
                <span className="font-bold text-gray-900 dark:text-white">Free for Customers</span>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors rounded-xl font-bold text-gray-900 dark:text-white border border-transparent dark:border-gray-800">
            Edit Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
