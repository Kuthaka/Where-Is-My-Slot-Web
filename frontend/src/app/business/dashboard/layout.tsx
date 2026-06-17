"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout as reduxLogout } from "@/store/slices/authSlice";
import { Store, LogOut, Menu } from "lucide-react";
import Header from "@/components/Header";
import BusinessSidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";

interface DashboardContextType {
  business: any;
  setBusiness: (b: any) => void;
  user: any;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardLayout");
  return context;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<any>(null);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map route to activeTab for Sidebar highlight
  const getActiveTab = () => {
    if (pathname === "/business/dashboard") return "overview";
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/posts")) return "posts";
    if (pathname.includes("/offers")) return "offers";
    if (pathname.includes("/parking")) return "parking";
    if (pathname.includes("/security")) return "security";
    return "overview";
  };
  const activeTab = getActiveTab();

  useEffect(() => {
    const fetchBusiness = async () => {
      if (authLoading) return;
      if (!user) {
        router.push("/business/login");
        return;
      }
      
      const token = localStorage.getItem("token");
      try {
        const busRes = await fetch("http://localhost:5000/api/v1/businesses/me", { headers: { Authorization: `Bearer ${token}` } });
        if (busRes.ok) {
          const busData = await busRes.json();
          const extractedBusiness = busData.data !== undefined ? busData.data : busData;
          setBusiness(extractedBusiness || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [user, authLoading, router]);

  const handleLogout = () => {
    dispatch(reduxLogout());
    router.push("/business/login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a1a]">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ business, setBusiness, user }}>
      <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
        <Header />
        
        <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-hidden">
          {/* Desktop Sidebar */}
          <BusinessSidebar activeTab={activeTab} setActiveTab={(tab) => {}} handleLogout={handleLogout} />

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-[300px] h-full" onClick={e => e.stopPropagation()}>
                <BusinessSidebar 
                  activeTab={activeTab} 
                  setActiveTab={(tab) => { setMobileMenuOpen(false); }} 
                  handleLogout={handleLogout} 
                />
              </div>
            </div>
          )}

          {/* Center Content Area */}
          <div className="flex-1 max-w-[680px] w-full mx-auto overflow-y-auto h-full relative no-scrollbar pb-8">
            {/* Mobile Header (Hidden on Desktop) */}
            <header className="lg:hidden bg-white dark:bg-[#242424] rounded-3xl border border-gray-100 dark:border-gray-800 p-4 mb-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl text-gray-900 dark:text-white">
                  <Menu size={20} />
                </button>
                <span className="font-black text-xl text-gray-900 dark:text-white">Merchant Hub</span>
              </div>
              <button onClick={handleLogout} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl">
                <LogOut size={20} />
              </button>
            </header>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto space-y-6">
              {!business && activeTab !== "security" ? (
                <div className="bg-white dark:bg-[#242424] p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[500px]">
                  <div className="bg-yellow-50 dark:bg-yellow-500/10 p-5 rounded-full text-yellow-500 mb-6">
                    <Store size={56} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">You haven't listed a business yet!</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    Get started by creating your premium business profile to manage bookings, create flash deals, and connect with your local community.
                  </p>
                  <button 
                    onClick={() => router.push("/business/register/onboarding")}
                    className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 transition-colors text-black rounded-xl font-bold text-lg shadow-lg shadow-yellow-400/20"
                  >
                    List Your Business Now
                  </button>
                </div>
              ) : (
                children
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
