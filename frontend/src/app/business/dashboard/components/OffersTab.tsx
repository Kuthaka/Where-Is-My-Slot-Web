"use client";

import { Gift, Plus } from "lucide-react";

export default function OffersTab({ business }: { business: any }) {
  if (!business) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Flash Deals & Offers</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your active promotions and discounts.</p>
        </div>
        <button className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black shadow-sm flex items-center gap-2">
          <Plus size={18} /> Create Offer
        </button>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#242424] rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-32 bg-gradient-to-tr from-yellow-400 to-red-500 p-6 flex flex-col justify-end">
            <span className="bg-white text-black text-xs font-black px-3 py-1 rounded-full w-max uppercase tracking-wider mb-2">Active</span>
            <h3 className="text-xl font-black text-white">20% OFF Everything</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">Get a flat 20% discount on all items in-store this weekend. Show this code at the counter.</p>
            <div className="flex items-center justify-between">
              <div className="bg-gray-100 dark:bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="font-mono font-bold text-gray-900 dark:text-white tracking-widest">WEEKEND20</span>
              </div>
              <span className="text-xs font-bold text-gray-400">Ends in 2 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242424] border border-dashed border-gray-200 dark:border-gray-700 rounded-[28px] p-6 flex flex-col items-center justify-center text-center min-h-[250px] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors">
          <div className="bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-full text-yellow-500 mb-4">
            <Gift size={24} />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">Launch a New Offer</h4>
          <p className="text-sm text-gray-500 mt-2 max-w-[200px]">Create flash sales and special deals to attract more customers.</p>
        </div>
      </div>

    </div>
  );
}
