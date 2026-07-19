"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { Search, MapPin, Car, Store, Navigation, Users, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Map, List } from "lucide-react";

const ParkingMapView = dynamic(() => import("@/components/ParkingMapView"), { ssr: false });

const API_URL = "http://localhost:5000/api/v1";

export default function ParkingPage() {
  const [parkings, setParkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentLocation } = useSelector((state: RootState) => state.location);
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, FREE, BUSINESS, COMMUNITY
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchParking = useCallback(async () => {
    if (!currentLocation?.latitude || !currentLocation?.longitude) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: currentLocation.latitude.toString(),
        lng: currentLocation.longitude.toString(),
        radius: "5000" // 5km
      });

      if (activeFilter === "FREE") params.append("isFree", "true");
      if (activeFilter === "BUSINESS") params.append("source", "BUSINESS");
      if (activeFilter === "COMMUNITY") params.append("source", "COMMUNITY");

      const res = await fetch(`${API_URL}/parking/search?${params}`);
      const data = await res.json();
      if (res.ok) {
        setParkings(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch parking:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, activeFilter]);

  useEffect(() => {
    fetchParking();
  }, [fetchParking]);

  const renderParkingCard = (spot: any) => {
    const isBusiness = spot.source === 'BUSINESS';
    const totalCarSlots = spot.slots?.car?.total || 0;
    const occupiedCars = spot.slots?.car?.occupied || 0;
    const available = Math.max(0, totalCarSlots - occupiedCars);
    
    // Simple heuristic for availability
    let statusColor = "text-green-500";
    if (totalCarSlots > 0) {
      const ratio = available / totalCarSlots;
      if (ratio < 0.2) statusColor = "text-red-500";
      else if (ratio < 0.5) statusColor = "text-yellow-500";
    }

    return (
      <div key={spot._id} className="bg-white dark:bg-[#242424] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-lg text-gray-900 dark:text-white truncate max-w-[200px]">{spot.name}</h3>
              {spot.pricingType === "FREE" && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md">FREE</span>}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={12} className="text-yellow-500" />
              {spot.address || spot.city}
            </p>
          </div>
          <div className={`flex flex-col items-end ${statusColor}`}>
            <span className="text-2xl font-black leading-none">{available}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-medium">
            <Car size={16} />
            {totalCarSlots} Total Slots
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-medium">
            {isBusiness ? <Store size={16} /> : <Users size={16} />}
            {isBusiness ? "Business Lot" : "Community Lot"}
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => window.open(`https://maps.google.com/?q=${spot.location.coordinates[1]},${spot.location.coordinates[0]}`, '_blank')}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-black transition-colors rounded-xl font-bold text-gray-900 dark:text-white flex justify-center items-center gap-2 text-sm"
          >
            <Navigation size={16} /> Navigate
          </button>
          
          {isBusiness && spot.businessId && (
            <Link href={`/b/${spot.businessId._id || spot.businessId}`} className="py-2.5 px-4 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors rounded-xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
              <Store size={16} />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-white font-sans pt-[72px]">
      <Header />
      
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Find Parking</h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            {mounted && currentLocation?.address 
              ? `Showing available parking spots near ${currentLocation.address.split(',')[0]}`
              : "Discover real-time parking availability across the city."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl text-gray-500">
              <Filter size={16} />
            </div>
            {['ALL', 'FREE', 'BUSINESS', 'COMMUNITY'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                  ? 'bg-yellow-400 text-black shadow-sm' 
                  : 'bg-white dark:bg-[#242424] text-gray-600 dark:text-gray-300 hover:bg-gray-50 border border-gray-200 dark:border-gray-800'
                }`}
              >
                {filter === 'ALL' ? 'All Parking' : filter === 'FREE' ? 'Free Only' : filter === 'BUSINESS' ? 'Business Lots' : 'Community'}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-800 rounded-xl p-1 shadow-sm shrink-0">
            <button 
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={16} /> List
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Map size={16} /> Map
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <div className="w-full">
            <ParkingMapView parkings={parkings} currentLocation={currentLocation} />
          </div>
        ) : (
          <>
            {/* Grid */}
            {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[180px] bg-gray-100 dark:bg-[#242424] animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : parkings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parkings.map(renderParkingCard)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#242424] rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car size={36} />
            </div>
            <h3 className="text-xl font-black mb-2">No parking spots found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any parking locations matching your criteria nearby.</p>
          </div>
        )}
          </>
        )}
      </div>
    </main>
  );
}
