"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Navigation2, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const DEALS = [
  { id: 1, name: "Third Wave", time: "45m", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop", storyImg: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=1600&fit=crop" },
  { id: 2, name: "Zara", time: "2h", img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop", storyImg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1600&fit=crop" },
  { id: 3, name: "Tali", time: "15m", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop", storyImg: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1600&fit=crop" },
  { id: 4, name: "Truffles", time: "34m", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop", storyImg: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=1600&fit=crop" },
  { id: 5, name: "Cult", time: "", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop", storyImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1600&fit=crop" },
];

export default function FlashDeals() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex < DEALS.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
      } else {
        setActiveStoryIndex(null);
      }
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  useEffect(() => {
    if (activeStoryIndex === null) return;
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeStoryIndex]);

  // Prevent scrolling when story is open
  useEffect(() => {
    if (activeStoryIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeStoryIndex]);

  return (
    <>
      <div className="py-5 bg-white border-b border-gray-200 md:border md:rounded-xl md:mb-6 md:shadow-sm">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="font-extrabold text-lg text-gray-900 tracking-tight">Flash Deals</h2>
          <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md tracking-wide">Live Now</span>
        </div>
        <div className="flex overflow-x-auto gap-5 px-5 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {DEALS.map((deal, idx) => (
            <div key={deal.id} onClick={() => setActiveStoryIndex(idx)} className="flex flex-col items-center gap-1.5 min-w-[76px] cursor-pointer group">
              <div className="relative">
                <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${deal.time ? 'bg-gradient-to-tr from-purple-600 to-pink-500' : 'bg-gray-200'}`}>
                  <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white">
                    <Image unoptimized src={deal.img} alt={deal.name} width={70} height={70} className="w-full h-full object-cover" />
                  </div>
                </div>
                {deal.time && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-[1.5px] border-white shadow-sm">
                    {deal.time}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 truncate w-full text-center mt-2 group-hover:text-purple-600 transition-colors">{deal.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black md:bg-black/90 flex items-center justify-center backdrop-blur-sm">
          {/* Desktop Navigation (Prev) */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            className="hidden md:flex absolute left-4 xl:left-20 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors z-50"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative w-full max-w-[420px] h-full md:h-[85vh] md:rounded-2xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col">
            {/* Story Background Image */}
            <Image unoptimized src={DEALS[activeStoryIndex].storyImg} alt="Story" fill className="object-cover" priority />
            
            {/* Dark overlay at top and bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

            {/* Click areas for mobile navigation */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
            <div className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />

            {/* Content Container (z-30 to be above overlays and click areas) */}
            <div className="relative z-30 flex flex-col h-full pointer-events-none">
              
              {/* Progress Bars */}
              <div className="pt-3 px-3 flex gap-1.5 w-full pointer-events-auto">
                {DEALS.map((_, idx) => (
                  <div key={idx} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      key={activeStoryIndex} // Force re-render on active index change to restart animation
                      className={`h-full bg-white ${idx === activeStoryIndex ? 'animate-story-progress' : idx < activeStoryIndex ? 'w-full' : 'w-0'}`} 
                    />
                  </div>
                ))}
              </div>

              {/* Profile Header */}
              <div className="px-3 pt-3 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-sm">
                    <Image unoptimized src={DEALS[activeStoryIndex].img} alt="Profile" width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2 drop-shadow-md">
                    <span className="text-white font-bold text-sm">{DEALS[activeStoryIndex].name}</span>
                    <span className="text-white/70 text-[13px] font-medium">{DEALS[activeStoryIndex].time || '1h'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-white hover:text-gray-300 transition-colors drop-shadow-md p-1"><MoreHorizontal size={22} /></button>
                  <button onClick={() => setActiveStoryIndex(null)} className="text-white hover:text-gray-300 transition-colors drop-shadow-md p-1"><X size={26} /></button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pb-6 px-6 pointer-events-auto flex flex-col items-center">
                <div className="text-center mb-5 drop-shadow-md">
                  <h3 className="text-white font-extrabold text-2xl tracking-tight mb-1">Exclusive Offer!</h3>
                  <p className="text-white/90 text-sm font-medium">Swipe up or tap navigate to claim your deal before it expires.</p>
                </div>
                <button className="w-full max-w-[280px] flex items-center justify-center gap-2 bg-white text-gray-900 font-extrabold py-4 rounded-full text-[15px] transition-transform hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(255,255,255,0.2)]">
                  <Navigation2 size={20} strokeWidth={2.5} className="-rotate-45" />
                  Navigate
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation (Next) */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            className="hidden md:flex absolute right-4 xl:right-20 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors z-50"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
