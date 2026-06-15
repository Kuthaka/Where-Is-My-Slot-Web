"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { 
  Home, Moon, Sun, Bookmark, 
  MapPin, Compass, Car
} from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full h-[72px] bg-white/80 dark:bg-[#242424]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-[1440px] mx-auto w-full h-full flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6 flex-1">
          {/* Logo Placeholder */}
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer">
            <div className="w-5 h-5 bg-white dark:bg-black rounded-bl-xl rounded-tr-xl"></div>
          </div>
          
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
          <button className="text-yellow-400 flex flex-col items-center gap-1 group">
            <Home size={24} className="fill-current" />
            <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
          </button>
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
        <div className="flex items-center justify-end flex-1 gap-4">
          
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

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 cursor-pointer hover:border-yellow-400 transition-colors shrink-0">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
