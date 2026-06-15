"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, ChevronRight, X, CheckCircle2, Store, MapPin, Heart, MessageCircle, Share2, Send, Trash2 } from "lucide-react";

export default function FeedArea() {
  const [activeFlashIndex, setActiveFlashIndex] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [activeComments, setActiveComments] = useState<{ [key: string]: any[] }>({});
  const [user, setUser] = useState<any>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data || data);
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const fetchPosts = async (cursor?: string) => {
    if (loading || (!hasMore && cursor)) return;
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/v1/posts?limit=5${cursor ? '&cursor=' + cursor : ''}${user?.id ? '&userId=' + user.id : ''}`;
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.id]); // Re-fetch if user logs in to get correct like status

  const lastPostElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(nextCursor!);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, nextCursor]);

  const toggleLike = async (postId: string) => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              _count: { ...p._count, likes: data.data.isLiked ? p._count.likes + 1 : p._count.likes - 1 },
              isLikedByMe: data.data.isLiked
            };
          }
          return p;
        }));
      }
    } catch (err) {}
  };

  const fetchComments = async (postId: string) => {
    if (activeComments[postId]) {
      // Toggle off
      const newObj = { ...activeComments };
      delete newObj[postId];
      setActiveComments(newObj);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setActiveComments(prev => ({ ...prev, [postId]: data.data || data }));
      }
    } catch (err) {}
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!user) return alert("Please login to comment");
    const text = commentText[postId]?.trim();
    if (!text) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } } : p));
        // Add to active comments if open
        if (activeComments[postId]) {
          setActiveComments(prev => ({ ...prev, [postId]: [...prev[postId], data.data || data] }));
        }
      }
    } catch (err) {}
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (!confirm("Delete comment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, comments: Math.max(0, p._count.comments - 1) } } : p));
        if (activeComments[postId]) {
          setActiveComments(prev => ({ ...prev, [postId]: prev[postId].filter((c: any) => c.id !== commentId) }));
        }
      }
    } catch (err) {}
  };

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

  return (
    <>
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
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;
            return (
            <article 
              key={post.id} 
              ref={isLast ? lastPostElementRef : null}
              className="bg-white dark:bg-[#242424] rounded-[28px] p-5 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0">
                  {post.business?.logo ? (
                    <img src={post.business.logo} alt={post.business.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store size={20} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-black text-gray-900 dark:text-white hover:underline cursor-pointer">{post.business?.name}</h3>
                    {post.business?.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500">@{post.business?.username || post.business?.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <span className="text-sm font-bold text-gray-400">· {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-[15px] text-gray-900 dark:text-gray-100 mb-4 font-medium whitespace-pre-wrap leading-relaxed">
                {post.text}
              </p>

              {/* Post Image */}
              {post.image && (
                <div className="w-full max-h-[450px] rounded-[24px] overflow-hidden mb-4 relative group border border-gray-100 dark:border-gray-800">
                  <img src={post.image} alt="Artwork" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between mb-5 px-1 pt-2 border-t border-gray-100 dark:border-gray-800/60 mt-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors group ${post.isLikedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Heart size={20} fill={post.isLikedByMe ? "currentColor" : "none"} />
                    <span className="text-sm font-bold">{post._count?.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => fetchComments(post.id)}
                    className={`flex items-center gap-1.5 transition-colors group ${activeComments[post.id] ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                  >
                    <MessageCircle size={20} fill={activeComments[post.id] ? "currentColor" : "none"} className={activeComments[post.id] ? 'text-blue-500' : ''} />
                    <span className="text-sm font-bold">{post._count?.comments || 0}</span>
                  </button>
                  <button className="text-gray-500 hover:text-green-500 transition-colors flex items-center gap-1.5 group">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {activeComments[post.id] && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                    {activeComments[post.id].length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2 font-bold">No comments yet. Be the first!</p>
                    ) : (
                      activeComments[post.id].map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 items-start group/comment">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                            <span className="w-full h-full flex items-center justify-center text-xs font-black text-gray-500">{comment.user.name.charAt(0)}</span>
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
                    <div className="w-9 h-9 rounded-full bg-yellow-400 shrink-0 flex items-center justify-center text-black font-black">
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

            </article>
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
          
          <div className="h-40"></div>
        </div>
      </section>

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
    </>
  );
}
