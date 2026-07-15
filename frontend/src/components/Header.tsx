"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { 
  Home, Moon, Sun, Bookmark, 
  MapPin, Compass, Car, User, LogOut, Search
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout as reduxLogout } from "@/store/slices/authSlice";
import { saveLocationToBackend, LocationData } from "@/store/slices/locationSlice";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentLocation, loading: locationLoading } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch<AppDispatch>();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Location search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/location/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data.results || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(reduxLogout());
    setDropdownOpen(false);
    toast.success("Successfully logged out");
    router.push("/login");
  };

  const handleSelectLocation = async (location: LocationData) => {
    try {
      await dispatch(saveLocationToBackend(location)).unwrap();
      toast.success("Location set successfully");
      setLocationModalOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err: any) {
      toast.error(err || "Failed to set location");
    }
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
          
          await dispatch(saveLocationToBackend({
            address: newLoc,
            latitude,
            longitude
          })).unwrap();

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

  const locationDisplay = currentLocation?.address 
    ? (currentLocation.address.split(',')[0] || currentLocation.address)
    : "Set Location";

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
              <MapPin size={16} className="text-yellow-500 shrink-0" />
              <span className="truncate max-w-[120px]">{mounted ? locationDisplay : "Set Location"}</span>
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
            onClick={() => !locationLoading && !isFetchingLocation && setLocationModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-400/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <MapPin size={28} className="text-yellow-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Set Your Location
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                Discover businesses, flash deals, and events near you.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for your city or area..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#242424] border border-gray-200 dark:border-gray-800 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="max-h-[200px] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#242424] shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(result)}
                      disabled={locationLoading}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      {result.address}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold text-gray-400">
                  <span className="bg-white dark:bg-[#1a1a1a] px-2">OR</span>
                </div>
              </div>

              <button
                onClick={handleFetchLocation}
                disabled={isFetchingLocation || locationLoading}
                className="w-full px-6 py-3.5 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isFetchingLocation || locationLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Fetching...
                  </>
                ) : (
                  "Use Current Location"
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
