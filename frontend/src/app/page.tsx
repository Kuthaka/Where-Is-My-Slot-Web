"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { 
  Home, User, MessageCircle, Settings, 
  Moon, Sun, Search, Heart, Share2, 
  Bookmark, Send, CheckCircle2, ChevronRight,
  X, MapPin, Store, Zap
} from "lucide-react";

export default function AppLandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFlashIndex, setActiveFlashIndex] = useState<number | null>(null);

  const flashDeals = [
    { id: 1, name: "Social Offline", offer: "Happy Hour 1+1 \uD83C\uDF79", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=1200&fit=crop" },
    { id: 2, name: "Cult Fit", offer: "Free Trial \uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop" },
    { id: 3, name: "Nike Store", offer: "Flat 50% Off \uD83D\uDC5F", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=1200&fit=crop" },
    { id: 4, name: "Truffles", offer: "Free Fries \uD83C\uDF54", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=1200&fit=crop" },
    { id: 5, name: "Third Wave", offer: "BOGO Coffee \u2615", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=1200&fit=crop" },
    { id: 6, name: "Zudio", offer: "Summer Sale \uD83D\uDC55", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop", storyImg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1200&fit=crop" },
    { id: 7, name: "View All", offer: "More deals", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop", storyImg: "", isMore: true }
  ];

  const handleNextFlash = () => {
    if (activeFlashIndex !== null && activeFlashIndex < flashDeals.length - 2) {
      setActiveFlashIndex(activeFlashIndex + 1);
    } else {
      setActiveFlashIndex(null);
    }
  };

  const handlePrevFlash = () => {
    if (activeFlashIndex !== null && activeFlashIndex > 0) {
      setActiveFlashIndex(activeFlashIndex - 1);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      {/* Top Header */}
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
          <div className="flex items-center justify-center gap-6 flex-1">
            <button className="text-yellow-400 flex flex-col items-center gap-1 group">
              <Home size={24} className="fill-current" />
              <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
            </button>
            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <User size={24} />
            </button>
            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <MessageCircle size={24} />
            </button>
            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Settings size={24} />
            </button>
            
            {/* Theme Switcher */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border border-transparent dark:border-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center justify-end flex-1">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-hidden">
        
        {/* LEFT COLUMN: Fixed Profile Side */}
        <aside className="hidden lg:flex w-[320px] flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 flex flex-col items-center border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            {/* Arch Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-[140px] bg-gradient-to-b from-gray-900 to-transparent dark:from-black/50 pointer-events-none flex items-center justify-center overflow-hidden">
               <div className="w-[180px] h-[180px] border-[8px] border-yellow-400/80 rounded-full absolute -top-[90px]"></div>
               <div className="w-[240px] h-[240px] border-[8px] border-yellow-400/40 rounded-full absolute -top-[120px]"></div>
               <div className="w-[300px] h-[300px] border-[8px] border-yellow-400/20 rounded-full absolute -top-[150px]"></div>
            </div>

            <div className="w-full flex justify-center items-start mt-[80px] relative z-10 text-center px-2">
              <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden border-4 border-white dark:border-[#242424] -mt-[60px] shadow-lg shrink-0">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-center mt-4 w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Elviz Dizzouza</h2>
              <p className="text-sm text-gray-500 mb-6">@elvizoodem</p>
              <button className="w-full py-3 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors font-bold text-sm text-gray-800 dark:text-gray-200 shadow-inner">
                My Profile
              </button>
            </div>
          </div>

          {/* List Your Business CTA */}
          <div className="px-2">
            <a href="/business/register" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-950 font-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] group relative overflow-hidden">
              <Store className="group-hover:scale-110 transition-transform" />
              List your business
              <span className="absolute top-0 right-0 bg-white text-yellow-600 text-[10px] font-extrabold px-2 py-1 rounded-bl-xl">FREE</span>
            </a>
          </div>

        </aside>

        {/* CENTER COLUMN: Scrollable Instagram-like Feed */}
        <section className="flex-1 max-w-[680px] w-full mx-auto h-full overflow-y-auto no-scrollbar pb-32">
          
          {/* Flash Sales Row (Instagram Stories Style) */}
          <div className="mb-2 px-2 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Zap className="text-yellow-500 fill-yellow-500" size={18} /> Flash Sales Live
            </h3>
            <span className="text-xs text-blue-500 font-bold cursor-pointer">See all</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
            {flashDeals.map((deal, i) => (
              <div 
                key={deal.id} 
                onClick={() => !deal.isMore && setActiveFlashIndex(i)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="relative w-[78px] h-[78px] rounded-[24px] border-[3px] border-transparent group-hover:border-yellow-400 p-[2px] transition-colors bg-gradient-to-tr from-yellow-400 to-red-500 rounded-[26px]">
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-[#1a1a1a] border-2 border-white dark:border-[#1a1a1a]">
                    <img src={deal.img} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {deal.isMore && (
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="block text-[12px] font-bold text-gray-900 dark:text-white truncate w-[80px]">{deal.name}</span>
                  <span className="block text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 truncate w-[80px]">{deal.offer}</span>
                </div>
              </div>
            ))}
          </div>



          {/* Post Feed */}
          <div className="space-y-6">
            {[
              {
                id: 1,
                authorName: "George Jose",
                handle: "@george",
                time: "1 hour ago",
                avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
                content: "Lorem ipsum dolor sit amet consectetur. Porttitor.",
                image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&h=600&fit=crop",
                verified: true
              },
              {
                id: 2,
                authorName: "Sarah Connor",
                handle: "@sarah_c",
                time: "3 hours ago",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                content: "Just finished a great UI design session. Exploring some new brutalist concepts for an upcoming project. What do you guys think?",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
                verified: false
              },
              {
                id: 3,
                authorName: "Marcus Daily",
                handle: "@marcus_d",
                time: "5 hours ago",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                content: "Coffee and code. The only way to start a Monday morning properly ☕️💻",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
                verified: true
              }
            ].map((post) => (
              <article key={post.id} className="bg-white dark:bg-[#242424] rounded-[28px] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden">
                    <img src={post.avatar} alt={post.authorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-500">{post.handle}</span>
                      {post.verified && <CheckCircle2 size={14} className="text-blue-500 fill-current" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-gray-900 dark:text-white">{post.authorName}</h3>
                      <span className="text-sm font-bold text-yellow-500">. {post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  {post.content}
                </p>

                {/* Post Image */}
                <div className="w-full h-[380px] rounded-3xl overflow-hidden mb-4 relative group">
                  <img src={post.image} alt="Artwork" className="w-full h-full object-cover" />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mb-5 px-1">
                  <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-red-500 transition-colors">
                      <Heart size={22} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle size={22} />
                    </button>
                    <button className="text-gray-500 hover:text-green-500 transition-colors">
                      <Share2 size={22} />
                    </button>
                  </div>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl transition-colors">
                    Save
                  </button>
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 opacity-80">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Me" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Write your comment.." 
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none border border-transparent dark:border-gray-800"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Empty space filler for scrolling demonstration */}
            <div className="h-40"></div>
          </div>
        </section>

        {/* RIGHT COLUMN: Fixed Activity Side */}
        <aside className="hidden xl:flex w-[340px] flex-col shrink-0 h-full overflow-y-auto no-scrollbar pb-8 gap-8">
          
          {/* Recent Businesses Section */}
          <div>
            <div className="px-2 mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Recent Businesses</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: "The Grand Cafe", info: "Joined 2 days ago", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop" },
                { name: "Urban Fitness", info: "Joined 4 days ago", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop" },
                { name: "Nike Official", info: "Joined last week", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" }
              ].map((biz, i) => (
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
              {[
                { name: "Starbucks", dist: "200m away", rating: "4.8", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop" },
                { name: "Puma Store", dist: "500m away", rating: "4.5", img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
                { name: "Truffles Burger", dist: "800m away", rating: "4.9", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
                { name: "Zudio Fashion", dist: "1.2km away", rating: "4.4", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" }
              ].map((biz, i) => (
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

      </main>

      {/* Instagram Story-like Flash Deal Viewer Overlay */}
      {activeFlashIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          
          {/* Close Button */}
          <button 
            onClick={() => setActiveFlashIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50 p-2"
          >
            <X size={32} />
          </button>

          {/* Story Container */}
          <div className="relative w-full max-w-[420px] h-[90vh] max-h-[850px] bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Progress Bars */}
            <div className="absolute top-4 left-0 w-full px-4 flex gap-1.5 z-20">
              {flashDeals.filter(d => !d.isMore).map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white rounded-full ${
                      i === activeFlashIndex ? 'animate-story-progress' : i < activeFlashIndex ? 'w-full' : 'w-0'
                    }`}
                    onAnimationEnd={() => i === activeFlashIndex && handleNextFlash()}
                  ></div>
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-0 w-full px-4 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 overflow-hidden">
                <img src={flashDeals[activeFlashIndex].img} alt="Store" className="w-full h-full object-cover" />
              </div>
              <div className="text-white drop-shadow-md">
                <p className="font-bold text-sm flex items-center gap-1">
                  {flashDeals[activeFlashIndex].name}
                  <CheckCircle2 size={12} className="text-blue-400 fill-current" />
                </p>
                <p className="text-xs opacity-80">Sponsored</p>
              </div>
            </div>

            {/* Image Content */}
            <div className="absolute inset-0 z-0">
              <img 
                src={flashDeals[activeFlashIndex].storyImg} 
                alt="Offer" 
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            </div>

            {/* Flash Deal Offer Text Overlay */}
            <div className="absolute bottom-[160px] left-0 w-full px-6 z-20 text-center">
              <div className="bg-yellow-400 text-black font-black text-3xl p-4 rounded-2xl transform -rotate-2 shadow-xl border-4 border-white inline-block">
                {flashDeals[activeFlashIndex].offer}
              </div>
              <p className="text-white font-bold text-lg mt-4 drop-shadow-lg">Swipe up to claim before it ends!</p>
            </div>

            {/* Bottom Actions Container */}
            <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col gap-3 z-20">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
                <Store size={20} />
                Visit Business Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors">
                <MapPin size={20} />
                Navigate to Map
              </button>
            </div>

            {/* Navigation Tap Zones */}
            <div 
              className="absolute inset-y-0 left-0 w-[30%] z-10 cursor-pointer" 
              onClick={handlePrevFlash}
            />
            <div 
              className="absolute inset-y-0 right-0 w-[70%] z-10 cursor-pointer" 
              onClick={handleNextFlash}
            />

          </div>
        </div>
      )}

    </div>
  );
}
