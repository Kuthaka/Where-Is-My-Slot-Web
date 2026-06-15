"use client";

import { Store, MapPin, Star } from "lucide-react";

export default function RightSidebar() {
  const similarBusinesses = [
    {
      id: 1,
      name: "The Coffee Bean",
      category: "Cafe",
      distance: "1.2 km",
      rating: 4.8,
      logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Urban Brew",
      category: "Coffee & Bakery",
      distance: "2.5 km",
      rating: 4.6,
      logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Sunset Diner",
      category: "Restaurant",
      distance: "3.0 km",
      rating: 4.5,
      logo: null,
    }
  ];

  return (
    <aside className="hidden xl:flex w-[340px] flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-8">
      
      {/* Similar Businesses Widget */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="font-black text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2">
          <Store className="text-yellow-500" size={20} />
          Similar Near You
        </h3>

        <div className="space-y-5">
          {similarBusinesses.map((biz) => (
            <div key={biz.id} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                {biz.logo ? (
                  <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Store className="text-gray-400" size={20} />
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-yellow-500 transition-colors">
                  {biz.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">{biz.category}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-900 dark:text-white mb-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  {biz.rating}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-400 uppercase">
                  <MapPin size={10} />
                  {biz.distance}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-gray-200 dark:border-gray-800">
          View all competitors
        </button>
      </div>

      {/* Analytics Widget */}
      <div className="bg-gradient-to-br from-[#2C5EAD] to-[#1591DC] rounded-[32px] p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Store size={120} />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm">Insights</span>
          <h3 className="font-black text-xl mt-4 mb-2">You're in the top 10%</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">Your profile views are higher than 90% of businesses in your area this week.</p>
          <button className="w-full py-2.5 bg-white text-[#2C5EAD] hover:bg-gray-50 font-black rounded-xl transition-colors text-sm shadow-sm">
            View Analytics
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 text-xs font-medium text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">About</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Help Center</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
        <span className="w-full mt-2">© 2026 Where-Is-My-Slot</span>
      </div>

    </aside>
  );
}
