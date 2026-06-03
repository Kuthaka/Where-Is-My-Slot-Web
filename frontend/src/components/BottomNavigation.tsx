import { Home, Map, Plus, Wallet, User } from "lucide-react";

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-xl mx-auto w-full px-6 h-[72px] flex items-center justify-between relative">
        <button className="flex flex-col items-center justify-center gap-1.5 text-purple-600 transition-transform active:scale-95">
          <Home size={24} strokeWidth={2.5} className="fill-purple-100" />
          <span className="text-[10px] font-extrabold tracking-wide">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-900 transition-all active:scale-95">
          <Map size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Map</span>
        </button>
        
        {/* Floating Action Button */}
        <div className="relative -top-6">
          <button className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(17,24,39,0.3)] border-[5px] border-white hover:scale-105 transition-transform active:scale-95">
            <Plus size={32} strokeWidth={2.5} />
          </button>
        </div>

        <button className="flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-900 transition-all active:scale-95">
          <Wallet size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Wallet</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-900 transition-all active:scale-95">
          <User size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>
      </div>
    </div>
  );
}
