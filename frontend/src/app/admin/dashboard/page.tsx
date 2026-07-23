"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle, XCircle, Clock, MapPin, Store, LogOut, ChevronRight, Activity, Users } from "lucide-react";
import { useModal } from "@/components/ModalProvider";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const { showModal } = useModal();

  const fetchBusinesses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/v1/businesses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
        }
        throw new Error("Failed to fetch businesses");
      }
      
      const data = await res.json();
      const list = data.data || data;
      setBusinesses(list);
      
      // Calculate stats
      const pending = list.filter((b: any) => b.status === "PENDING").length;
      const approved = list.filter((b: any) => b.status === "APPROVED").length;
      setStats({ total: list.length, pending, approved });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [router]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    showModal({
      title: "Confirm Action",
      message: `Are you sure you want to ${action} this business?`,
      type: "confirm",
      confirmText: "Yes",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/api/v1/businesses/${id}/${action}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!res.ok) throw new Error(`Failed to ${action} business`);
          
          // Refresh list
          fetchBusinesses();
        } catch (err) {
          console.error(err);
          showModal({ title: "Error", message: `Error: ${err}`, type: "error" });
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("businessToken");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "businessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/50 border border-blue-500">
            <Shield size={20} />
          </div>
          <span className="font-black text-xl text-white tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Store size={20} />
            Merchants
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-800 transition-colors">
            <Users size={20} />
            Users
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-gray-950/50 backdrop-blur-md border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-white">Merchant Applications</h1>
            <p className="text-sm text-gray-400 mt-1">Review and manage business directory listings.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-xl text-blue-400"><Store size={24} /></div>
              <div>
                <p className="text-sm font-bold text-gray-400">Total Merchants</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-4">
              <div className="bg-yellow-500/20 p-4 rounded-xl text-yellow-400"><Clock size={24} /></div>
              <div>
                <p className="text-sm font-bold text-gray-400">Pending Review</p>
                <p className="text-3xl font-black text-white">{stats.pending}</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-4">
              <div className="bg-green-500/20 p-4 rounded-xl text-green-400"><CheckCircle size={24} /></div>
              <div>
                <p className="text-sm font-bold text-gray-400">Approved</p>
                <p className="text-3xl font-black text-white">{stats.approved}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Activity size={20} className="text-blue-400" /> Recent Applications
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900/50 border-b border-gray-700 text-xs uppercase tracking-wider font-black text-gray-500">
                    <th className="p-4 pl-6">Business Info</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {businesses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                        No businesses found in the system.
                      </td>
                    </tr>
                  ) : (
                    businesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-700/20 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                              {business.logo ? (
                                <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
                              ) : (
                                <Store size={20} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white">{business.name}</p>
                              <p className="text-xs text-blue-400 font-medium">{business.primaryCategory || "Uncategorized"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-1.5 text-gray-300">
                            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-2 max-w-[200px]">
                              {business.address}, {business.city}, {business.state} {business.pincode}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-white">{business.email}</p>
                          <p className="text-xs text-gray-400">{business.phone}</p>
                        </td>
                        <td className="p-4">
                          {business.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Pending
                            </span>
                          )}
                          {business.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                              <CheckCircle size={14} /> Approved
                            </span>
                          )}
                          {business.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                              <XCircle size={14} /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {business.status === "PENDING" && (
                              <>
                                <button 
                                  onClick={() => handleAction(business.id, 'approve')}
                                  className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20 hover:border-transparent"
                                  title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => handleAction(business.id, 'reject')}
                                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 hover:border-transparent"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600 ml-2">
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
