"use client";

import { CheckCircle2, MapPin, Link as LinkIcon, Calendar, Image as ImageIcon, Gift, MoreHorizontal, Heart, MessageCircle, Share2, BarChart2 } from "lucide-react";

export default function OverviewTab({ business }: { business: any }) {
  if (!business) return null;

  // Dummy posts for visual representation
  const dummyPosts = [
    {
      id: 1,
      text: "We just updated our weekend menu! 🌮 Come down and try the new Spicy Tacos, available only this Saturday and Sunday. Let us know what you think!",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80",
      time: "2h",
      likes: 45,
      comments: 12,
      views: "1.2K"
    },
    {
      id: 2,
      text: "Thank you to everyone who made our grand reopening a massive success! 🎉 We're open everyday from 9 AM to 10 PM. See you soon!",
      image: null,
      time: "1d",
      likes: 128,
      comments: 34,
      views: "5.4K"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
          {business.coverPhoto && <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6 pt-3 relative">
          <div className="flex justify-between items-start">
            <div className="absolute -top-16 border-4 border-white dark:border-[#242424] w-32 h-32 rounded-full bg-white dark:bg-[#1a1a1a] shadow-md overflow-hidden flex items-center justify-center">
              {business.logo ? (
                <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-gray-300">{business.name?.charAt(0)}</span>
              )}
            </div>
            
            <div className="ml-auto mt-2">
              <button className="px-5 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-full font-bold text-gray-900 dark:text-white transition-colors text-sm">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              {business.name}
              {business.isVerified && <CheckCircle2 className="text-blue-500 w-5 h-5" fill="currentColor" stroke="white" />}
            </h1>
            <p className="text-gray-500 font-medium">@{business.username || business.name.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
          
          <div className="mt-4 text-gray-900 dark:text-gray-100 leading-relaxed text-[15px]">
            {business.description || business.tagline || "Welcome to our official business page! Follow us for updates, offers, and more."}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{business.city || "Bangalore"}, {business.state || "IN"}</span>
            </div>
            {business.websiteUrl && (
              <div className="flex items-center gap-1.5">
                <LinkIcon size={16} />
                <a href={business.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{business.websiteUrl.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>Joined {new Date(business.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="mt-5 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <span className="font-black text-gray-900 dark:text-white">124</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <span className="font-black text-gray-900 dark:text-white">8,492</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Composer (Create Post) */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] shrink-0 overflow-hidden">
          {business.logo && <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <textarea 
            placeholder="What's happening?" 
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-xl placeholder-gray-500 text-gray-900 dark:text-white min-h-[60px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
            <div className="flex items-center gap-2 text-yellow-500">
              <button className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
              <button className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-full transition-colors"><Gift size={20} /></button>
              <button className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-full transition-colors"><MapPin size={20} /></button>
            </div>
            <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full transition-colors shadow-sm">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {dummyPosts.map(post => (
          <div key={post.id} className="bg-white dark:bg-[#242424] rounded-[32px] p-5 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer">
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden shrink-0">
                  {business.logo && <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 dark:text-white hover:underline">{business.name}</span>
                    {business.isVerified && <CheckCircle2 className="text-blue-500 w-4 h-4" fill="currentColor" stroke="white" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span>@{business.username || business.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <span>·</span>
                    <span className="hover:underline">{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-[15px] leading-normal">
                {post.text}
              </p>
              
              {post.image && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <img src={post.image} alt="Post media" className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}
            </div>

            {/* Engagement Action Bar */}
            <div className="flex items-center justify-between mt-5 pt-1 text-gray-500 max-w-md">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10"><MessageCircle size={18} /></div>
                <span className="text-xs font-bold">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-500/10"><Share2 size={18} /></div>
              </button>
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-500/10"><Heart size={18} /></div>
                <span className="text-xs font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-yellow-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10"><BarChart2 size={18} /></div>
                <span className="text-xs font-bold">{post.views}</span>
              </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
