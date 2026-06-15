"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { 
  Home, Moon, Sun, Bookmark, 
  MapPin, Compass, Car, User, LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data || data);
        } else {
          // Token invalid, clear it
          localStorage.removeItem("token");
        }
      } catch (err) {}
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setDropdownOpen(false);
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 w-full h-[72px] bg-white/80 dark:bg-[#242424]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-[1440px] mx-auto w-full h-full flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6 flex-1">
          {/* Logo Placeholder */}
          <Link href="/" className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer transition-transform hover:scale-105">
            <div className="w-5 h-5 bg-white dark:bg-black rounded-bl-xl rounded-tr-xl"></div>
          </Link>
          
          {/* Search */}
          <div className="relative w-full max-w-sm hidden md:block">
            <input 
              type="text" 
              placeholder="#Explore" 
              className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-transparent dark:border-gray-800 text-sm rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center justify-center gap-8 flex-1">
          <Link href="/" className="text-yellow-400 flex flex-col items-center gap-1 group">
            <Home size={24} className="fill-current" />
            <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
          </Link>
          <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Explore">
            <Compass size={24} />
          </button>
          <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Parking">
            <Car size={24} />
          </button>
          <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Saved">
            <Bookmark size={24} />
          </button>
        </div>

        {/* User Actions & Avatar */}
        <div className="flex items-center justify-end flex-1 gap-4 relative">
          
          {/* Theme Switcher */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border border-transparent dark:border-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300">
            <MapPin size={16} className="text-yellow-500" />
            <span className="truncate max-w-[120px]">Set Location</span>
          </button>

          {mounted && (
            user ? (
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 cursor-pointer hover:border-yellow-400 transition-colors shrink-0"
                >
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#242424] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
                    <Link 
                      href={user.role === 'BUSINESS' ? "/business/dashboard" : "/profile"} 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                    >
                      <User size={16} />
                      {user.role === 'BUSINESS' ? 'Business Dashboard' : 'My Profile'}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm transition-colors shadow-sm"
              >
                Log In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
