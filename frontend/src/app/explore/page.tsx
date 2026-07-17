"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LeftSidebar from "@/components/Home/LeftSidebar";
import {
  Search, Zap, MapPin, Phone, CheckCircle2, Store,
  X, TrendingUp, Star, Grid3X3, List, ChevronRight,
  Coffee, Dumbbell, ShoppingBag, Scissors, Car, Utensils,
  Building2, Heart, BookOpen, Music, Wifi, Package
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const API_URL = "http://localhost:5000/api/v1";

const CATEGORIES = [
  { label: "All", icon: Grid3X3 },
  { label: "Restaurant", icon: Utensils },
  { label: "Cafe", icon: Coffee },
  { label: "Gym", icon: Dumbbell },
  { label: "Retail", icon: ShoppingBag },
  { label: "Salon", icon: Scissors },
  { label: "Parking", icon: Car },
  { label: "Hotel", icon: Building2 },
  { label: "Healthcare", icon: Heart },
  { label: "Education", icon: BookOpen },
  { label: "Entertainment", icon: Music },
  { label: "Tech", icon: Wifi },
  { label: "Other", icon: Package },
];

const CATEGORY_COLORS: Record<string, string> = {
  Restaurant: "from-orange-400 to-red-500",
  Cafe: "from-amber-400 to-orange-500",
  Gym: "from-blue-400 to-indigo-500",
  Retail: "from-pink-400 to-fuchsia-500",
  Salon: "from-purple-400 to-violet-500",
  Parking: "from-slate-400 to-gray-600",
  Hotel: "from-teal-400 to-cyan-500",
  Healthcare: "from-green-400 to-emerald-500",
  Education: "from-yellow-400 to-amber-500",
  Entertainment: "from-red-400 to-pink-500",
  Tech: "from-cyan-400 to-blue-500",
  Other: "from-gray-400 to-gray-500",
};

function getCategoryGradient(cat?: string): string {
  if (!cat) return "from-yellow-400 to-yellow-600";
  const key = Object.keys(CATEGORY_COLORS).find(k =>
    cat.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CATEGORY_COLORS[key] : "from-yellow-400 to-yellow-600";
}

function BusinessCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#242424] rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
      <div className="h-[140px] bg-gray-200 dark:bg-[#333]" />
      <div className="p-4">
        <div className="flex items-end gap-3 -mt-8 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-[#444] border-4 border-white dark:border-[#242424] shrink-0" />
          <div className="flex-1 pb-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-[#444] rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-[#444] rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-[#444] rounded w-full mt-2" />
        <div className="h-3 bg-gray-200 dark:bg-[#444] rounded w-2/3 mt-1" />
      </div>
    </div>
  );
}

function BusinessCard({ biz, onFlashClick }: { biz: any; onFlashClick: () => void }) {
  const hasActiveDeal = biz.flashDeals && biz.flashDeals.length > 0;
  const gradient = getCategoryGradient(biz.primaryCategory);

  return (
    <Link href={`/b/${biz.id || biz._id}`} className="block h-full">
      <article className="bg-white dark:bg-[#242424] rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer h-full flex flex-col">
        {/* Cover / Banner */}
        <div className={`relative h-[160px] bg-gradient-to-br ${gradient} overflow-hidden shrink-0`}>
          {biz.coverPhoto ? (
            <img src={biz.coverPhoto} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-80`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Active Flash Deal Badge */}
          {hasActiveDeal && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFlashClick(); }}
              className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-400 text-black text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse-slow hover:scale-110 transition-transform z-10"
            >
              <Zap size={10} className="fill-current" />
              LIVE DEAL
            </button>
          )}
        </div>

        <div className="px-5 pb-5 flex-1 flex flex-col">
          {/* Logo + Name Row */}
          <div className="flex items-end gap-3 -mt-10 mb-4 relative z-10">
            <div className={`w-20 h-20 rounded-2xl border-4 border-white dark:border-[#242424] shadow-md overflow-hidden bg-gradient-to-br ${gradient} shrink-0`}>
              {biz.logo ? (
                <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover bg-white" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-black text-2xl">
                  {biz.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 pb-1 min-w-0">
              {biz.primaryCategory && (
                <span className="inline-block px-2.5 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[10px] font-black uppercase tracking-wider rounded-lg mb-1.5">
                  {biz.primaryCategory}
                </span>
              )}
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight truncate group-hover:text-yellow-500 transition-colors">{biz.name}</h3>
                {biz.isVerified && <CheckCircle2 size={16} className="text-blue-500 fill-current shrink-0" />}
              </div>
            </div>
          </div>

          {/* Tagline */}
          {biz.tagline ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-4 line-clamp-2 flex-1">{biz.tagline}</p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-500 italic leading-snug mb-4 line-clamp-2 flex-1">
              {biz.description || "No description provided."}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
            {(biz.area || biz.city) && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-yellow-500" />
                <span className="truncate max-w-[120px]">{[biz.area, biz.city].filter(Boolean).join(", ")}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 ml-auto">
              <Store size={14} />
              {biz._count?.posts || 0} posts
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Flash deal story state
  const [groupedDeals, setGroupedDeals] = useState<{ business: any; deals: any[] }[]>([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [activeDealIndex, setActiveDealIndex] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);

  const { currentLocation } = useSelector((state: RootState) => state.location);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBusinesses = useCallback(async (cursor?: string, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "12" });
      if (cursor) params.append("cursor", cursor);
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (activeCategory !== "All") params.append("category", activeCategory);
      if (currentLocation?.address) {
        // Extract main city name (e.g. "Kochi" from "Kochi, Kerala")
        const city = currentLocation.address.split(",")[0].trim();
        params.append("city", city);
      }

      const res = await fetch(`${API_URL}/businesses/explore?${params}`);
      const data = await res.json();
      if (res.ok) {
        const payload = data.data || data;
        const items: any[] = Array.isArray(payload.businesses) ? payload.businesses : [];
        setBusinesses(prev => reset ? items : [...prev, ...items]);
        setNextCursor(payload.nextCursor ?? null);
        setHasMore(!!payload.hasMore);
      }
    } catch (err) {
      console.error('[Explore] Failed to fetch businesses:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory, currentLocation]);

  // Fetch businesses when filters change
  useEffect(() => {
    setBusinesses([]);
    setNextCursor(null);
    setHasMore(true);
    fetchBusinesses(undefined, true);
  }, [debouncedSearch, activeCategory, currentLocation]);

  // Fetch flash deals
  useEffect(() => {
    const loadDeals = async () => {
      try {
        const res = await fetch(`${API_URL}/flash-deals`);
        const data = await res.json();
        if (res.ok) {
          const deals = data.data ?? data;
          const map = new Map<string, { business: any; deals: any[] }>();
          deals.forEach((d: any) => {
            if (!map.has(d.businessId)) map.set(d.businessId, { business: d.business, deals: [] });
            map.get(d.businessId)!.deals.push(d);
          });
          setGroupedDeals(Array.from(map.values()));
        }
      } catch {}
    };
    loadDeals();
  }, []);

  // Infinite scroll
  const lastCardElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && nextCursor) {
        fetchBusinesses(nextCursor);
      }
    }, { rootMargin: "200px" });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, nextCursor, fetchBusinesses]);

  // Story navigation
  const handleNextFlash = () => {
    if (activeGroupIndex === null) return;
    const cur = groupedDeals[activeGroupIndex];
    if (activeDealIndex < cur.deals.length - 1) {
      setActiveDealIndex(i => i + 1);
    } else if (activeGroupIndex < groupedDeals.length - 1) {
      setActiveGroupIndex(i => (i ?? 0) + 1);
      setActiveDealIndex(0);
    } else {
      setActiveGroupIndex(null);
      setActiveDealIndex(0);
    }
  };

  const handlePrevFlash = () => {
    if (activeGroupIndex === null) return;
    if (activeDealIndex > 0) {
      setActiveDealIndex(i => i - 1);
    } else if (activeGroupIndex > 0) {
      const prev = groupedDeals[activeGroupIndex - 1];
      setActiveGroupIndex(i => (i ?? 1) - 1);
      setActiveDealIndex(prev.deals.length - 1);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-hidden">
        <LeftSidebar />

        {/* Main Explore Content */}
        <section className="flex-1 h-full overflow-y-auto no-scrollbar pb-32">

          {/* Hero Search */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <TrendingUp className="text-yellow-500" size={28} />
              Explore {mounted && currentLocation?.address ? `in ${currentLocation.address.split(",")[0]}` : ""}
            </h1>
            <p className="text-gray-500 font-medium mb-4">Discover the best local businesses near you</p>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search businesses, categories, areas..."
                className="w-full bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Flash Deals Stories Row */}
          {groupedDeals.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="text-yellow-500 fill-yellow-500" size={18} />
                  Flash Deals Live
                </h2>
                <span className="text-xs text-blue-500 font-bold cursor-pointer">See all</span>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                {groupedDeals.map((group, i) => (
                  <div
                    key={group.business.id}
                    onClick={() => { setActiveGroupIndex(i); setActiveDealIndex(0); }}
                    className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-[72px] h-[72px] rounded-[22px] p-[2.5px] bg-gradient-to-tr from-yellow-400 to-red-500 group-hover:shadow-lg group-hover:shadow-yellow-400/30 transition-all duration-300">
                      <div className="w-full h-full rounded-[18px] overflow-hidden bg-white dark:bg-[#1a1a1a] border-2 border-white dark:border-[#1a1a1a]">
                        <img
                          src={group.business.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"}
                          alt={group.business.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Zap size={9} className="text-black fill-current" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate w-[72px] text-center leading-tight">
                      {group.business.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-6">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shrink-0 transition-all duration-200 ${
                  activeCategory === label
                    ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/30 scale-105"
                    : "bg-white dark:bg-[#242424] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-yellow-400 hover:text-yellow-500"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && businesses.length > 0 && (
            <p className="text-sm text-gray-500 font-medium mb-4">
              {businesses.length} businesses found
              {activeCategory !== "All" && <span className="text-yellow-500 font-bold"> in {activeCategory}</span>}
              {debouncedSearch && <span className="text-yellow-500 font-bold"> for "{debouncedSearch}"</span>}
            </p>
          )}

          {/* Business Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {businesses.map((biz, i) => {
              const isLast = i === businesses.length - 1;
              return (
                <div key={biz.id} ref={isLast ? lastCardElementRef : null}>
                  <BusinessCard
                    biz={biz}
                    onFlashClick={() => {
                      const idx = groupedDeals.findIndex(g => g.business.id === biz.id);
                      if (idx !== -1) { setActiveGroupIndex(idx); setActiveDealIndex(0); }
                    }}
                  />
                </div>
              );
            })}

            {/* Loading Skeletons */}
            {loading && Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
          </div>

          {/* Empty State */}
          {!loading && businesses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-yellow-400/10 text-yellow-500 rounded-3xl flex items-center justify-center mb-4">
                <Store size={36} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No businesses found</h3>
              <p className="text-gray-500 max-w-xs">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}". Try a different search.`
                  : `No businesses in ${activeCategory} yet. Check back soon!`}
              </p>
              {(debouncedSearch || activeCategory !== "All") && (
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  className="mt-4 px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* End of results */}
          {!hasMore && businesses.length > 0 && (
            <p className="text-center text-gray-400 font-bold text-sm py-8">You've seen all businesses!</p>
          )}

          <div className="h-20" />
        </section>
      </main>

      {/* Flash Deal Story Viewer */}
      {activeGroupIndex !== null && groupedDeals[activeGroupIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <button
            onClick={() => { setActiveGroupIndex(null); setActiveDealIndex(0); }}
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50 p-2"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-[420px] h-[90vh] max-h-[850px] bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Progress Bars */}
            <div className="absolute top-4 left-0 w-full px-4 flex gap-1.5 z-20">
              {groupedDeals[activeGroupIndex].deals.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white rounded-full ${i === activeDealIndex ? 'animate-story-progress' : i < activeDealIndex ? 'w-full' : 'w-0'}`}
                    onAnimationEnd={() => i === activeDealIndex && handleNextFlash()}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-0 w-full px-4 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 overflow-hidden">
                <img
                  src={groupedDeals[activeGroupIndex].business.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"}
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white drop-shadow-md">
                <p className="font-bold text-sm flex items-center gap-1">
                  {groupedDeals[activeGroupIndex].business.name}
                  {groupedDeals[activeGroupIndex].business.isVerified && (
                    <CheckCircle2 size={12} className="text-blue-400 fill-current" />
                  )}
                </p>
                <p className="text-xs opacity-70">{groupedDeals[activeGroupIndex].deals[activeDealIndex].type}</p>
              </div>
            </div>

            {/* Full-screen Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={groupedDeals[activeGroupIndex].deals[activeDealIndex].image}
                alt="Deal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* Offer Text */}
            <div className="absolute bottom-[160px] left-0 w-full px-6 z-20 text-center pointer-events-none">
              <div className="bg-yellow-400 text-black font-black text-3xl p-4 rounded-2xl transform -rotate-2 shadow-xl border-4 border-white inline-block">
                {groupedDeals[activeGroupIndex].deals[activeDealIndex].offer}
              </div>
              <p className="text-white font-bold text-lg mt-4 drop-shadow-lg">Grab it before it's gone! ⚡</p>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col gap-3 z-20">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
                <Store size={20} />
                Visit Business Profile
              </button>
              {groupedDeals[activeGroupIndex].deals[activeDealIndex].navigateLink && (
                <button
                  onClick={() => window.open(groupedDeals[activeGroupIndex].deals[activeDealIndex].navigateLink, '_blank')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <MapPin size={20} />
                  Navigate
                </button>
              )}
            </div>

            {/* Tap Zones */}
            <div className="absolute inset-y-0 left-0 w-[30%] z-10 cursor-pointer" onClick={handlePrevFlash} />
            <div className="absolute inset-y-0 right-0 w-[70%] z-10 cursor-pointer" onClick={handleNextFlash} />
          </div>
        </div>
      )}
    </div>
  );
}
