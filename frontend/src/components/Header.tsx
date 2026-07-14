"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { 
  Home, Moon, Sun, Bookmark, 
  MapPin, Compass, Car, User, LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout as reduxLogout } from "@/store/slices/authSlice";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [locationName, setLocationName] = useState("Set Location");
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setLocationName(savedLocation);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(reduxLogout());
    setDropdownOpen(false);
    toast.success("Successfully logged out");
    router.push("/login");
  };

  const handleFetchLocation = () => {
    setIsFetchingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error("Failed to fetch location");
          const data = await res.json();
          let newLoc = "Your Location";
          if (data.address) {
            newLoc =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              data.address.county ||
              newLoc;
          }
          setLocationName(newLoc);
          localStorage.setItem("userLocation", newLoc);
          toast.success("Location updated successfully");
          setLocationModalOpen(false);
        } catch (error) {
          toast.error("Failed to fetch location details");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        toast.error("Location access denied or unavailable");
      }
    );
  };

  return (
    <>
      <header className="fixed top-0 w-full h-[72px] bg-white/80 dark:bg-[#242424]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40">
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
            <Link href="/" className={`flex flex-col items-center gap-1 group transition-colors ${pathname === '/' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              <Home size={24} className={pathname === '/' ? 'fill-current' : ''} />
              {pathname === '/' && <div className="w-1 h-1 rounded-full bg-yellow-400"></div>}
            </Link>
            <Link href="/explore" className={`flex flex-col items-center gap-1 group transition-colors ${pathname === '/explore' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              <Compass size={24} className={pathname === '/explore' ? 'fill-current' : ''} />
              {pathname === '/explore' && <div className="w-1 h-1 rounded-full bg-yellow-400"></div>}
            </Link>
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

            <button 
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300"
            >
              <MapPin size={16} className="text-yellow-500" />
              <span className="truncate max-w-[120px]">{mounted ? locationName : "Set Location"}</span>
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

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isFetchingLocation && setLocationModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <MapPin size={32} className="text-yellow-500" />
            </div>
            
            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">
              Enable Location
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-sm leading-relaxed">
              We need access to your location to show relevant businesses, offers, and events near you.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleFetchLocation}
                disabled={isFetchingLocation}
                className="w-full px-6 py-3.5 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isFetchingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Fetching...
                  </>
                ) : (
                  "Use Current Location"
                )}
              </button>
              <button
                onClick={() => setLocationModalOpen(false)}
                disabled={isFetchingLocation}
                className="w-full px-6 py-3.5 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
