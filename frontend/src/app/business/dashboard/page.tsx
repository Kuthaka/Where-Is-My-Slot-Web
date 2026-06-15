"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, LogOut, LayoutDashboard, CalendarDays, Ticket, Shield } from "lucide-react";

export default function MerchantDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [passwordState, setPasswordState] = useState({ oldPassword: "", newPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("overview");

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
    router.push("/business/login");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setPasswordState({ oldPassword: "", newPassword: "" });
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
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === "overview" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === "security" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <Shield size={20} />
            Security
          </button>
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
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back, {user?.name || "Merchant"}!</h1>
            <p className="text-sm text-gray-500 mt-1">Here is what&apos;s happening with your business today.</p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
          {!business ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-purple-100 p-4 rounded-full text-purple-600 mb-6">
                <Store size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">You haven&apos;t listed a business yet!</h2>
              <p className="text-gray-500 mb-8 max-w-md">Get started by creating your business profile to manage bookings, create offers, and track your performance.</p>
              <button 
                onClick={() => router.push("/business/register/onboarding")}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 transition-colors text-white rounded-xl font-bold flex items-center gap-2"
              >
                List Your Business Now
              </button>
            </div>
          ) : activeTab === "overview" && (
            <>
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
            </>
          )}

          {business && activeTab === "security" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                {user?.isPasswordSet ? "Change Password" : "Set Password"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {user?.isPasswordSet
                  ? "Update your password to keep your account secure."
                  : "Set a password to login with your email instead of using an OTP."}
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {user?.isPasswordSet && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Old Password</label>
                    <input
                      type="password"
                      required
                      value={passwordState.oldPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, oldPassword: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
                  />
                </div>

                {passwordMessage.text && (
                  <div className={`p-3 rounded-lg text-sm font-bold ${passwordMessage.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? "Saving..." : user?.isPasswordSet ? "Update Password" : "Set Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
