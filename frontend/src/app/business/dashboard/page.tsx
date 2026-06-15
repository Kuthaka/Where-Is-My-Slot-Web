"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, LogOut, Menu, X } from "lucide-react";
import Header from "@/components/Header";
import BusinessSidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import OverviewTab from "./components/OverviewTab";
import ProfileTab from "./components/ProfileTab";
import ParkingTab from "./components/ParkingTab";
import PostsTab from "./components/PostsTab";
import OffersTab from "./components/OffersTab";
import SecurityTab from "./components/SecurityTab";

export default function MerchantDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/business/login");
        return;
      }
      try {
        const [authRes, busRes] = await Promise.all([
          fetch("http://localhost:5000/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/v1/businesses/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (authRes.ok) {
          const authData = await authRes.json();
          setUser(authData.data || authData);
        } else {
          router.push("/business/login");
          return;
        }

        if (busRes.ok) {
          const busData = await busRes.json();
          const extractedBusiness = busData.data !== undefined ? busData.data : busData;
          if (extractedBusiness) {
            setBusiness(extractedBusiness);
          } else {
            setBusiness(null);
          }
        }
      } catch (err) {
        router.push("/business/login");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/business/login");
  };

  const handlePasswordSubmit = async (e: React.FormEvent, passwordState: any) => {
    setPasswordMessage({ type: "", text: "" });
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: passwordState.newPassword,
          ...(user?.isPasswordSet ? { oldPassword: passwordState.oldPassword } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Failed to update password");
      }
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setUser({ ...user, isPasswordSet: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPasswordMessage({ type: "error", text: err.message });
      } else {
        setPasswordMessage({ type: "error", text: "An error occurred" });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a1a]">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-hidden">
        {/* Desktop Sidebar */}
        <BusinessSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-[300px] h-full" onClick={e => e.stopPropagation()}>
            <BusinessSidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} 
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
            <>
              {activeTab === "overview" && <OverviewTab business={business} />}
              {activeTab === "profile" && <ProfileTab business={business} />}
              {activeTab === "parking" && <ParkingTab business={business} />}
              {activeTab === "posts" && <PostsTab business={business} />}
              {activeTab === "offers" && <OffersTab business={business} />}
              {activeTab === "security" && (
                <SecurityTab 
                  user={user} 
                  handlePasswordSubmit={handlePasswordSubmit} 
                  passwordLoading={passwordLoading} 
                  passwordMessage={passwordMessage} 
                />
              )}
            </>
          )}

          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
        
      </main>

    </div>
  );
}
