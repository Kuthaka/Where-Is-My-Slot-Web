"use client";

import { Store, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LeftSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<{name: string, username: string | null} | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
         const user = data.data || data;
         if (user && user.name) {
           setUserData(user);
         }
      })
      .catch(err => console.error("Failed to fetch user data", err));
    }
  }, []);

  if (!mounted) return <aside className="hidden lg:flex w-[320px] shrink-0 h-full"></aside>;

  return (
    <aside className="hidden lg:flex w-[320px] flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-8">
      {isLoggedIn ? (
        <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 flex flex-col items-center border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[140px] bg-gradient-to-b from-gray-900 to-transparent dark:from-black/50 pointer-events-none flex items-center justify-center overflow-hidden">
             <div className="w-[180px] h-[180px] border-[8px] border-yellow-400/80 rounded-full absolute -top-[90px]"></div>
             <div className="w-[240px] h-[240px] border-[8px] border-yellow-400/40 rounded-full absolute -top-[120px]"></div>
             <div className="w-[300px] h-[300px] border-[8px] border-yellow-400/20 rounded-full absolute -top-[150px]"></div>
          </div>

          <div className="w-full flex justify-center items-start mt-[80px] relative z-10 text-center px-2">
            <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden border-4 border-white dark:border-[#242424] -mt-[60px] shadow-lg shrink-0">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center mt-4 w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {userData?.name || "Loading..."}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {userData?.username ? `@${userData.username}` : (userData ? "@user" : "...")}
            </p>
            <Link href="/profile" className="block w-full py-3 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors font-bold text-sm text-gray-800 dark:text-gray-200 shadow-inner">
              My Profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 flex flex-col items-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-16 h-16 bg-yellow-400/10 text-yellow-500 rounded-2xl flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">Join the Community</h2>
          <p className="text-sm text-gray-500 text-center mb-6 mt-2">
            Discover the best local businesses, flash deals, and parking spots near you.
          </p>
          <div className="w-full flex flex-col gap-3">
            <Link href="/login" className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 transition-colors font-bold text-sm text-black text-center shadow-inner">
              Log In
            </Link>
            <Link href="/register" className="w-full py-3 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors font-bold text-sm text-gray-800 dark:text-gray-200 text-center">
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* List Your Business CTA */}
      <div className="px-2">
        <Link href="/business/register" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-950 font-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] group relative overflow-hidden">
          <Store className="group-hover:scale-110 transition-transform" />
          List your business
          <span className="absolute top-0 right-0 bg-white text-yellow-600 text-[10px] font-extrabold px-2 py-1 rounded-bl-xl">FREE</span>
        </Link>
      </div>
    </aside>
  );
}
