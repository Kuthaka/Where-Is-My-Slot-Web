"use client";

import { MapPin } from "lucide-react";

export default function RightSidebar() {
  const recentBusinesses = [
    { name: "The Grand Cafe", info: "Joined 2 days ago", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop" },
    { name: "Urban Fitness", info: "Joined 4 days ago", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop" },
    { name: "Nike Official", info: "Joined last week", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" }
  ];

  const popularBusinesses = [
    { name: "Starbucks", dist: "200m away", rating: "4.8", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop" },
    { name: "Puma Store", dist: "500m away", rating: "4.5", img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
    { name: "Truffles Burger", dist: "800m away", rating: "4.9", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
    { name: "Zudio Fashion", dist: "1.2km away", rating: "4.4", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" }
  ];

  return (
    <aside className="hidden xl:flex w-[340px] flex-col shrink-0 h-full overflow-y-auto no-scrollbar pb-8 gap-8">
      {/* Recent Businesses Section */}
      <div>
        <div className="px-2 mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Recent Businesses</h3>
        </div>
        <div className="space-y-4">
          {recentBusinesses.map((biz, i) => (
            <div key={i} className="bg-white dark:bg-[#242424] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                  <img src={biz.img} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-[140px]">{biz.name}</h4>
                  <p className="text-[11px] text-yellow-600 dark:text-yellow-400 font-medium">{biz.info}</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-gray-500 hover:text-blue-500 transition-colors">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Businesses Near You Section */}
      <div>
        <div className="px-2 mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Popular Near You</h3>
        </div>
        <div className="space-y-4">
          {popularBusinesses.map((biz, i) => (
            <div key={i} className="bg-white dark:bg-[#242424] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={biz.img} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-gray-900 text-yellow-400 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-gray-700">
                    ★ {biz.rating}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-[140px]">{biz.name}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">{biz.dist}</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors group-hover:scale-110 shrink-0">
                <MapPin size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-600">Copyright © 2026 WhereIsMySlot</p>
      </div>
    </aside>
  );
}
