import { Bell, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
          <MapPin size={18} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-purple-600 font-bold tracking-wider">
            <span>CURRENT LOCATION</span>
            <ChevronDown size={12} strokeWidth={3} />
          </div>
          <div className="text-sm font-extrabold text-gray-900 leading-tight">
            MG Road, Bengaluru
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button className="relative text-gray-700 hover:text-gray-900 transition-colors">
          <Bell size={22} strokeWidth={2.5} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm cursor-pointer">
          <Image unoptimized src="https://ui-avatars.com/api/?name=User&background=111827&color=fff" alt="Profile" width={36} height={36} className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
