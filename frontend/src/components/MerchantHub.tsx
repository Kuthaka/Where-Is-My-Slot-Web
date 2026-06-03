import { Navigation2 } from "lucide-react";
import Image from "next/image";

export default function MerchantHub() {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-xl mx-auto w-full">
        <div className="bg-[#1a1625] rounded-3xl p-4 shadow-2xl border border-gray-800/60 pointer-events-auto backdrop-blur-xl bg-opacity-95">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-extrabold text-[15px] tracking-wide">Merchant Hub</h3>
            <button className="bg-white/10 text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider hover:bg-white/20 transition-colors uppercase">
              Preview
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/5 rounded-2xl p-3.5 flex flex-col items-center justify-center border border-white/5">
              <span className="text-green-400 font-black text-2xl tracking-tight">1.2k</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-[0.15em] mt-1.5">VIEWS</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3.5 flex flex-col items-center justify-center border border-white/5">
              <span className="text-purple-400 font-black text-2xl tracking-tight">84</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-[0.15em] mt-1.5">SAVES</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3.5 flex flex-col items-center justify-center border border-white/5">
              <span className="text-white font-black text-2xl tracking-tight">12</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-[0.15em] mt-1.5">REDEEMED</span>
            </div>
          </div>

          <div className="bg-black/50 rounded-2xl p-3.5 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-inner">
                <Image unoptimized src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop" alt="Blue Tokai" width={44} height={44} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold text-[13px]">Blue Tokai Coffee</span>
                  <span className="bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">PROMO</span>
                </div>
                <p className="text-gray-400 text-[11px] font-medium truncate max-w-[160px]">Free cookie with any cappuccino!</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-400 transition-colors shadow-lg shadow-green-500/25 shrink-0">
              <Navigation2 size={18} strokeWidth={2.5} className="-rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
