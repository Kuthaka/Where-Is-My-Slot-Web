"use client";

import { FileText, Plus, Image as ImageIcon, Zap, MoreHorizontal, Trash2, Edit2, X, Store, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import CreatePostModal from "@/components/CreatePostModal";
import CreateFlashDealModal from "@/components/CreateFlashDealModal";
import PostCard from "@/components/PostCard";
import { toast } from "react-hot-toast";

export default function PostsTab({ business, user }: { business: any, user?: any }) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isFlashDealModalOpen, setIsFlashDealModalOpen] = useState(false);
  const [activeFlashIndex, setActiveFlashIndex] = useState<number | null>(null);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingFlashDeals, setLoadingFlashDeals] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = async (cursor?: string) => {
    if (loadingPosts || (!hasMore && cursor)) return;
    setLoadingPosts(true);
    try {
      const url = `http://localhost:5000/api/v1/posts?limit=5&businessId=${business.id}${cursor ? '&cursor=' + cursor : ''}${user?.id ? '&userId=' + user.id : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        if (cursor) {
          setPosts(prev => [...prev, ...data.data.posts]);
        } else {
          setPosts(data.data.posts);
        }
        setNextCursor(data.data.nextCursor);
        setHasMore(!!data.data.nextCursor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchFlashDeals = async () => {
    setLoadingFlashDeals(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/flash-deals?businessId=${business.id}`);
      const data = await res.json();
      if (res.ok) {
        setFlashDeals(data.data ?? data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFlashDeals(false);
    }
  };

  useEffect(() => {
    if (business?.id) {
      fetchPosts();
      fetchFlashDeals();
    }
  }, [business?.id, user?.id]);

  const lastPostElementRef = useCallback((node: any) => {
    if (loadingPosts) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(nextCursor!);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingPosts, hasMore, nextCursor]);

  const handlePostCreated = (post: any) => {
    setPosts(prev => [post, ...prev]);
    setIsPostModalOpen(false);
  };

  const handleFlashDealCreated = (deal: any) => {
    // Reload flash deals to get nested business object
    fetchFlashDeals();
    setIsFlashDealModalOpen(false);
  };

  const deletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        toast.success("Post deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextFlash = () => {
    if (activeFlashIndex !== null && activeFlashIndex < flashDeals.length - 1) {
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

  if (!business) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Posts & Announcements</h2>
          <p className="text-gray-500 font-medium mt-1">Keep your audience updated with your latest news and deals.</p>
        </div>
      </div>

      {/* Flash Deals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="text-yellow-500 fill-yellow-500" size={20} /> Flash Deals
          </h3>
          <button
            onClick={() => setIsFlashDealModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all rounded-xl font-bold text-black shadow-sm flex items-center gap-2 hover:scale-[1.02]"
          >
            <Plus size={16} /> New Deal
          </button>
        </div>

        {loadingFlashDeals ? (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-[78px] h-[78px] bg-gray-100 dark:bg-[#242424] rounded-[24px] animate-pulse" />
                <div className="w-[60px] h-3 bg-gray-100 dark:bg-[#242424] rounded animate-pulse" />
                <div className="w-[40px] h-2 bg-gray-100 dark:bg-[#242424] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : flashDeals.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
            {flashDeals.map((deal, i) => (
              <div 
                key={deal.id} 
                onClick={() => setActiveFlashIndex(i)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="relative w-[78px] h-[78px] rounded-[24px] border-[3px] border-transparent group-hover:border-yellow-400 p-[2px] transition-colors bg-gradient-to-tr from-yellow-400 to-red-500">
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-[#1a1a1a] border-2 border-white dark:border-[#1a1a1a]">
                    <img src={business.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"} alt="Store" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-[12px] font-bold text-gray-900 dark:text-white truncate w-[80px]">{business.name}</span>
                  <span className="block text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 truncate w-[80px]">{deal.offer}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-400/20 text-yellow-500 rounded-full flex items-center justify-center mb-3">
              <Zap size={24} />
            </div>
            <p className="text-gray-900 dark:text-white font-bold mb-1">No active flash deals</p>
            <p className="text-gray-500 text-sm max-w-[250px]">Post a 24-hour flash deal to instantly reach your audience and drive traffic.</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> Recent Posts
          </h3>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-all rounded-xl font-bold text-gray-900 dark:text-white shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create Post
          </button>
        </div>

        {posts.length === 0 && !loadingPosts ? (
          <div className="bg-white dark:bg-[#242424] p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-5 rounded-full text-gray-400 mb-6">
              <FileText size={48} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-500 max-w-sm mb-6">Share updates, events, or behind-the-scenes moments to engage with your customers.</p>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black flex items-center gap-2"
            >
              <ImageIcon size={18} /> Share your first post
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-[600px] mx-auto">
            {posts.map((post, index) => {
              const isLast = index === posts.length - 1;
              return (
                <div ref={isLast ? lastPostElementRef : null} key={post.id}>
                  <PostCard
                    post={post}
                    onLike={() => {}}
                    onCommentClick={() => {}}
                    onShare={() => {}}
                    renderMenu={() => (
                      <div className="relative group/menu">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                          <MoreHorizontal size={20} />
                        </button>
                        <div className="absolute right-0 top-10 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl w-32 py-2 hidden group-hover/menu:block z-10">
                          <button onClick={() => deletePost(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              );
            })}
            {loadingPosts && <div className="text-center py-4 font-bold text-gray-400">Loading...</div>}
            {!hasMore && posts.length > 0 && <div className="text-center py-4 font-bold text-gray-400">You've reached the end!</div>}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
        business={business}
      />

      <CreateFlashDealModal
        isOpen={isFlashDealModalOpen}
        onClose={() => setIsFlashDealModalOpen(false)}
        onFlashDealCreated={handleFlashDealCreated}
        business={business}
      />

      {/* Flash Deal Viewer Overlay */}
      {activeFlashIndex !== null && flashDeals[activeFlashIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <button 
            onClick={() => setActiveFlashIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50 p-2"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-[420px] h-[90vh] max-h-[850px] bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            {/* Progress Bars */}
            <div className="absolute top-4 left-0 w-full px-4 flex gap-1.5 z-20">
              {flashDeals.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white rounded-full ${i === activeFlashIndex ? 'animate-story-progress' : i < activeFlashIndex ? 'w-full' : 'w-0'}`}
                    onAnimationEnd={() => i === activeFlashIndex && handleNextFlash()}
                  ></div>
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-0 w-full px-4 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 overflow-hidden">
                <img src={business.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"} alt="Store" className="w-full h-full object-cover" />
              </div>
              <div className="text-white drop-shadow-md">
                <p className="font-bold text-sm flex items-center gap-1">
                  {business.name}
                  {business.isVerified && <CheckCircle2 size={12} className="text-blue-400 fill-current" />}
                </p>
                <p className="text-xs opacity-80">{flashDeals[activeFlashIndex].type}</p>
              </div>
            </div>

            {/* Image */}
            <div className="absolute inset-0 z-0">
              <img src={flashDeals[activeFlashIndex].image} alt="Offer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            </div>

            {/* Offer Text */}
            <div className="absolute bottom-[160px] left-0 w-full px-6 z-20 text-center pointer-events-none">
              <div className="bg-yellow-400 text-black font-black text-3xl p-4 rounded-2xl transform -rotate-2 shadow-xl border-4 border-white inline-block">
                {flashDeals[activeFlashIndex].offer}
              </div>
              <p className="text-white font-bold text-lg mt-4 drop-shadow-lg">Swipe up to claim before it ends!</p>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col gap-3 z-20">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
                <Store size={20} />
                View Profile
              </button>
              {flashDeals[activeFlashIndex].navigateLink && (
                <button 
                  onClick={() => window.open(flashDeals[activeFlashIndex].navigateLink, '_blank')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <LinkIcon size={20} />
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
