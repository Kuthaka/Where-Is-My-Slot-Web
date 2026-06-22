"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, ChevronRight, X, CheckCircle2, Store, MapPin, Heart, MessageCircle, Share2, Send, Trash2 } from "lucide-react";
import PostCard from "../PostCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchPosts, toggleLikeOptimistic } from "@/store/slices/postsSlice";
import { useModal } from "@/components/ModalProvider";

const API_URL = "http://localhost:5000/api/v1";

const fallbackDeals = [
  { id: 'fallback-1', business: { name: "View All" }, offer: "More deals", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop", isMore: true }
];

export default function FeedArea() {
  const dispatch = useDispatch<AppDispatch>();
  const { feed: posts, nextCursor, hasMore, loading, initialLoaded } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);
  const { showModal } = useModal();

  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [activeFlashIndex, setActiveFlashIndex] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [activeComments, setActiveComments] = useState<{ [key: string]: any[] }>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const lastLoadedUserId = useRef<string | undefined>(undefined);

  // Initial load or re-load when user changes (to get correct like status)
  useEffect(() => {
    if (!initialLoaded || lastLoadedUserId.current !== user?.id) {
      lastLoadedUserId.current = user?.id;
      dispatch(fetchPosts({ userId: user?.id }));
    }
  }, [user?.id, initialLoaded, dispatch]);

  useEffect(() => {
    const loadFlashDeals = async () => {
      try {
        const res = await fetch(`${API_URL}/flash-deals`);
        const data = await res.json();
        if (res.ok) {
          setFlashDeals(data.data ?? data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadFlashDeals();
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !nextCursor) return;
    dispatch(fetchPosts({ cursor: nextCursor, userId: user?.id }));
  }, [loading, hasMore, nextCursor, user?.id, dispatch]);

  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin: '200px' });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const toggleLike = async (postId: string) => {
    if (!user) {
      showModal({ title: "Login Required", message: "Please login to like posts", type: "alert" });
      return;
    }
    // Optimistic update immediately
    dispatch(toggleLikeOptimistic(postId));
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Revert on failure
      dispatch(toggleLikeOptimistic(postId));
    }
  };

  const fetchComments = async (postId: string) => {
    if (activeComments[postId]) {
      const newObj = { ...activeComments };
      delete newObj[postId];
      setActiveComments(newObj);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setActiveComments(prev => ({ ...prev, [postId]: data.data ?? data }));
      }
    } catch {}
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!user) {
      showModal({ title: "Login Required", message: "Please login to comment", type: "alert" });
      return;
    }
    const text = commentText[postId]?.trim();
    if (!text) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        if (activeComments[postId]) {
          setActiveComments(prev => ({ ...prev, [postId]: [...prev[postId], data.data ?? data] }));
        }
      }
    } catch {}
  };

  const deleteComment = async (postId: string, commentId: string) => {
    showModal({
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      type: "confirm",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/posts/comments/${commentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok && activeComments[postId]) {
            setActiveComments(prev => ({ ...prev, [postId]: prev[postId].filter((c: any) => c.id !== commentId) }));
          }
        } catch {}
      }
    });
  };

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

  return (
    <>
      <section className="flex-1 max-w-[680px] w-full mx-auto h-full overflow-y-auto no-scrollbar pb-32">
        {/* Flash Sales Row */}
        <div className="mb-2 px-2 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Zap className="text-yellow-500 fill-yellow-500" size={18} /> Flash Sales Live
          </h3>
          <span className="text-xs text-blue-500 font-bold cursor-pointer">See all</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {flashDeals.length === 0 && (
            <p className="text-gray-500 text-sm">No flash deals currently active.</p>
          )}
          {flashDeals.map((deal, i) => (
            <div 
              key={deal.id} 
              onClick={() => !deal.isMore && setActiveFlashIndex(i)}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className="relative w-[78px] h-[78px] rounded-[24px] border-[3px] border-transparent group-hover:border-yellow-400 p-[2px] transition-colors bg-gradient-to-tr from-yellow-400 to-red-500">
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-[#1a1a1a] border-2 border-white dark:border-[#1a1a1a]">
                  <img src={deal.business?.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"} alt={deal.business?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                {deal.isMore && (
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
              <div className="text-center">
                <span className="block text-[12px] font-bold text-gray-900 dark:text-white truncate w-[80px]">{deal.business?.name}</span>
                <span className="block text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 truncate w-[80px]">{deal.offer}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;
            return (
                <div key={post.id} ref={isLast ? lastPostElementRef : null}>
                  <PostCard 
                    post={post}
                    onLike={toggleLike}
                    onCommentClick={fetchComments}
                    onShare={() => {}}
                  >
                {activeComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                      {activeComments[post.id].length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2 font-bold">No comments yet. Be the first!</p>
                      ) : (
                        activeComments[post.id].map((comment: any) => (
                          <div key={comment.id} className="flex gap-3 items-start group/comment">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 flex items-center justify-center text-xs font-black text-gray-500">
                              {comment.user.name.charAt(0)}
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl px-4 py-2 relative">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.user.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
                              {user?.id === comment.userId && (
                                <button 
                                  onClick={() => deleteComment(post.id, comment.id)}
                                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover/comment:block transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Comment Input */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-9 h-9 rounded-full bg-yellow-400 shrink-0 flex items-center justify-center text-black font-black text-sm">
                        {user ? user.name.charAt(0) : '?'}
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                          placeholder="Write a comment..." 
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none border border-gray-200 dark:border-gray-800 focus:border-yellow-400 transition-colors text-gray-900 dark:text-white"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                  </PostCard>
                </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-400 font-bold text-sm">You've reached the end!</div>
          )}
          {!loading && initialLoaded && posts.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-bold">No posts yet. Check back soon!</div>
          )}
          
          <div className="h-40"></div>
        </div>
      </section>

      {/* Flash Deal Story Viewer Overlay */}
      {activeFlashIndex !== null && (
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
              {flashDeals.filter(d => !d.isMore).map((_, i) => (
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
                <img src={flashDeals[activeFlashIndex].business?.logo || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"} alt="Store" className="w-full h-full object-cover" />
              </div>
              <div className="text-white drop-shadow-md">
                <p className="font-bold text-sm flex items-center gap-1">
                  {flashDeals[activeFlashIndex].business?.name}
                  {flashDeals[activeFlashIndex].business?.isVerified && <CheckCircle2 size={12} className="text-blue-400 fill-current" />}
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
                Visit Business Profile
              </button>
              {flashDeals[activeFlashIndex].navigateLink && (
                <button 
                  onClick={() => window.open(flashDeals[activeFlashIndex].navigateLink, '_blank')}
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
    </>
  );
}
