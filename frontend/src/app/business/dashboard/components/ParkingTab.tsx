"use client";

import { Car, MapPin, RefreshCw, AlertCircle, Save, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function ParkingTab({ business }: { business: any }) {
  const [parking, setParking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Real-time slot management state
  const [occupiedCars, setOccupiedCars] = useState(0);

  const [formData, setFormData] = useState({
    name: business?.name ? `${business.name} Parking` : "",
    totalCarSlots: 50,
    pricingType: "FREE",
    type: "OPEN"
  });
  const [parkingLocation, setParkingLocation] = useState<{lat: number, lng: number} | null>(
    business?.latitude && business?.longitude 
      ? { lat: business.latitude, lng: business.longitude } 
      : null
  );

  const fetchParking = async () => {
    try {
      const token = localStorage.getItem("businessToken") || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/parking/business/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setParking(data.data[0]); // For now, just handle their first parking lot
        setOccupiedCars(data.data[0].slots?.car?.occupied || 0);
      }
    } catch (error) {
      console.error("Error fetching parking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParking();
  }, [business]);

  const handleCreateParking = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("businessToken") || localStorage.getItem("token");
      const payload = {
        name: formData.name,
        address: business.address || "",
        city: business.city || "",
        location: {
          type: "Point",
          coordinates: parkingLocation ? [parkingLocation.lng, parkingLocation.lat] : [business.longitude || 0, business.latitude || 0]
        },
        pricingType: formData.pricingType,
        type: [formData.type],
        slots: {
          car: { total: formData.totalCarSlots, occupied: 0 },
          bike: { total: 0, occupied: 0 },
          ev: { total: 0, occupied: 0 }
        }
      };

      const res = await fetch("http://localhost:5000/api/v1/parking/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Parking configured successfully!");
        setParking(data.data);
        setIsCreating(false);
      } else {
        toast.error(data.message || "Failed to create parking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAvailability = async () => {
    if (!parking) return;
    try {
      const token = localStorage.getItem("businessToken") || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/parking/business/${parking._id || parking.id}/availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slots: {
            car: { occupied: occupiedCars }
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Live parking availability updated!");
        setParking(data.data);
      } else {
        toast.error(data.message || "Failed to update availability");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div></div>;
  }

  if (!parking && !isCreating) {
    return (
      <div className="bg-white dark:bg-[#242424] p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-gray-100 dark:bg-[#1a1a1a] p-5 rounded-full text-gray-400 mb-6">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Parking Not Configured</h3>
        <p className="text-gray-500 max-w-sm mb-6">You haven't enabled parking services for your business. Set up a parking zone to let customers know where to park.</p>
        <button onClick={() => setIsCreating(true)} className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black shadow-sm flex items-center gap-2">
          <Plus size={18} /> Configure Parking Settings
        </button>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="bg-white dark:bg-[#242424] p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Set Up Parking</h3>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Parking Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Total Car Slots</label>
            <input type="number" min="0" value={formData.totalCarSlots} onChange={e => setFormData({...formData, totalCarSlots: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-400 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pricing</label>
              <select value={formData.pricingType} onChange={e => setFormData({...formData, pricingType: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-400 outline-none">
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-400 outline-none">
                <option value="OPEN">Open</option>
                <option value="COVERED">Covered</option>
                <option value="VALET">Valet</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-4">Parking Location on Map</label>
            <div className="relative z-0">
              <MapPicker position={parkingLocation} setPosition={setParkingLocation} />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-bold">Drag or click to adjust the exact location of the parking lot.</p>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsCreating(false)} className="px-6 py-3 bg-gray-100 dark:bg-[#333] font-bold rounded-xl flex-1 hover:bg-gray-200">Cancel</button>
            <button onClick={handleCreateParking} disabled={submitting} className="px-6 py-3 bg-yellow-400 font-bold text-black rounded-xl flex-1 hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={18} /> {submitting ? "Saving..." : "Save Parking"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalCarSlots = parking.slots?.car?.total || 0;
  const availableCars = Math.max(0, totalCarSlots - occupiedCars);

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
            
            <h3 className="text-5xl font-black mb-2">{availableCars} <span className="text-2xl text-blue-200">/ {totalCarSlots}</span></h3>
            <p className="text-blue-100 font-medium mb-8">Slots currently available for customers</p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setOccupiedCars(Math.min(totalCarSlots, occupiedCars + 1))}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 border border-red-400 rounded-2xl flex flex-col items-center justify-center font-black transition-colors shadow-sm"
                title="Car Entered (Decrease Availability)"
              >
                <span className="text-2xl leading-none">-</span>
              </button>
              <button 
                onClick={() => setOccupiedCars(Math.max(0, occupiedCars - 1))}
                className="w-14 h-14 bg-green-500 hover:bg-green-600 border border-green-400 rounded-2xl flex flex-col items-center justify-center font-black transition-colors shadow-sm"
                title="Car Exited (Increase Availability)"
              >
                <span className="text-2xl leading-none">+</span>
              </button>
              
              <button onClick={handleUpdateAvailability} className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-colors ml-auto flex items-center gap-2 shadow-sm">
                <RefreshCw size={18} /> Broadcast Update
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
                <span className="text-gray-500 font-medium">Name</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{parking.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Total Capacity</span>
                <span className="font-bold text-gray-900 dark:text-white">{totalCarSlots} Cars</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Type</span>
                <span className="font-bold text-gray-900 dark:text-white capitalize">{parking.type?.[0]?.toLowerCase() || 'Open'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Pricing</span>
                <span className={`font-bold ${parking.pricingType === 'FREE' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                  {parking.pricingType === 'FREE' ? 'Free' : 'Paid'}
                </span>
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
