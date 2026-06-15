"use client";

import Header from "@/components/Header";
import { User, Mail, Phone, Edit2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const userData = data.data || data;
      if (userData && userData.name) {
        setUser({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
        });
      } else {
        router.push("/login");
      }
    })
    .catch(err => {
      console.error(err);
      router.push("/login");
    })
    .finally(() => {
      setLoading(false);
    });

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-y-auto no-scrollbar pb-8">
        {/* Profile Content */}
        <div className="w-full max-w-[800px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#242424] rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-[#1a1a1a] shadow-lg">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-2 rounded-xl shadow-md hover:scale-110 transition-transform">
                    <Edit2 size={16} />
                  </button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">
                    {user.username ? `@${user.username}` : "Free User"}
                  </p>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 font-bold transition-colors">
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <Mail size={18} />
                    <span className="text-sm font-bold">Email Address</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <User size={18} />
                    <span className="text-sm font-bold">Username</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{user.username ? `@${user.username}` : "Not provided"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
