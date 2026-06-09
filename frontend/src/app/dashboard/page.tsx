"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, LogOut, LayoutDashboard, CalendarDays, Ticket } from "lucide-react";

export default function MerchantDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl text-white shadow-lg shadow-purple-600/30">
            <Store size={20} />
          </div>
          <span className="font-black text-xl text-gray-900 tracking-tight">Merchant Hub</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold transition-colors">
            <LayoutDashboard size={20} />
            Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
            <CalendarDays size={20} />
            My Slots
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
            <Ticket size={20} />
            Active Offers
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
            <User size={20} />
            Profile
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back!</h1>
            <p className="text-sm text-gray-500 mt-1">Here is what's happening with your business today.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <span className="text-sm font-bold text-gray-500 mb-2">Total Bookings Today</span>
              <span className="text-4xl font-black text-gray-900">24</span>
              <span className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1">↑ 12% vs yesterday</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <span className="text-sm font-bold text-gray-500 mb-2">Active Offers</span>
              <span className="text-4xl font-black text-purple-600">3</span>
              <span className="text-xs font-bold text-gray-400 mt-2">1 offer expiring soon</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <span className="text-sm font-bold text-gray-500 mb-2">Profile Views</span>
              <span className="text-4xl font-black text-gray-900">1,204</span>
              <span className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1">↑ 5% this week</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center gap-4 p-4 border-2 border-purple-100 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-colors group text-left">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                  <Ticket size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Create New Offer</h4>
                  <p className="text-xs text-gray-500">Launch a flash sale or discount</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-gray-900 hover:bg-gray-50 transition-colors group text-left">
                <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-colors text-gray-600">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Manage Slots</h4>
                  <p className="text-xs text-gray-500">Update availability and timings</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
