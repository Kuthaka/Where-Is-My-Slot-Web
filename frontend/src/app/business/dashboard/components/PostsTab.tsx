"use client";

import { FileText, Plus, Image as ImageIcon } from "lucide-react";

export default function PostsTab({ business }: { business: any }) {
  if (!business) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Posts & Announcements</h2>
          <p className="text-gray-500 font-medium mt-1">Keep your audience updated with your latest news.</p>
        </div>
        <button className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black shadow-sm flex items-center gap-2">
          <Plus size={18} /> Create Post
        </button>
      </div>

      <div className="bg-white dark:bg-[#242424] p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-gray-100 dark:bg-[#1a1a1a] p-5 rounded-full text-gray-400 mb-6">
          <FileText size={48} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No posts yet</h3>
        <p className="text-gray-500 max-w-sm mb-6">Share updates, events, or behind-the-scenes moments to engage with your customers.</p>
        <button className="px-6 py-2.5 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors rounded-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon size={18} /> Share your first post
        </button>
      </div>

    </div>
  );
}
