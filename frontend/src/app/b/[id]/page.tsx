"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, MapPin, Phone, Mail, Globe, Clock, Info, Check, ArrowLeft, LayoutGrid, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function PublicBusinessProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Posts state
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Comments state
  const [activeComments, setActiveComments] = useState<{ [key: string]: any[] }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/businesses/${id}`);
        if (!res.ok) throw new Error("Business not found");
        const data = await res.json();
        const bizData = data.data || data;

        // Redirect if viewing own profile
        if (user && (user.id === bizData.id || user.id === bizData.ownerId)) {
          router.replace("/business/dashboard");
          return;
        }

        setBusiness(bizData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load business profile");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBusiness();
  }, [id, router, user]);

  const fetchPosts = async (cursor?: string) => {
    if (loadingPosts || (!hasMore && cursor)) return;
    setLoadingPosts(true);
    try {
      // Pass business ID to fetch only their posts
      const url = `http://localhost:5000/api/v1/posts?limit=10&businessId=${id}${cursor ? '&cursor=' + cursor : ''}`;
      const token = localStorage.getItem("token") || localStorage.getItem("businessToken");
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const res = await fetch(url, { headers });
      const data = await res.json();
      
      if (res.ok) {
        const fetchedPosts = data.data.posts || [];
        if (cursor) {
          setPosts(prev => [...prev, ...fetchedPosts]);
        } else {
          setPosts(fetchedPosts);
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

  useEffect(() => {
    if (business) fetchPosts();
  }, [business]);

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

  const toggleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("businessToken");
      if (!token) {
        toast.error("Please login to like posts");
        return;
      }
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
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setActiveComments(prev => ({ ...prev, [postId]: data.data || data }));
      }
    } catch (err) {}
  };

  const handleCommentSubmit = async (postId: string) => {
    const txt = commentText[postId]?.trim();
    if (!txt) return;
    
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("businessToken");
      if (!token) {
        toast.error("Please login to comment");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: txt })
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } } : p));
        if (activeComments[postId]) {
          setActiveComments(prev => ({ ...prev, [postId]: [...prev[postId], data.data || data] }));
        }
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col font-sans transition-colors duration-300">
      <Header />
      
      <main className="flex-1 max-w-[1000px] mx-auto w-full pt-[96px] px-4 lg:px-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Cover and Logo */}
        <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative mb-6">
          <div className="h-56 md:h-72 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
            {business.coverPhoto && <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="px-6 pb-8 pt-16 relative">
            <div className="absolute -top-20 left-6 w-36 h-36 rounded-3xl border-4 border-white dark:border-[#242424] bg-white dark:bg-[#1a1a1a] shadow-xl overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              {business.logo ? (
                <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-gray-300">{business.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mt-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  {business.name}
                  {business.isVerified && <CheckCircle2 className="text-blue-500 w-7 h-7" fill="currentColor" stroke="white" />}
                </h1>
                <p className="text-gray-500 font-bold mt-1.5 flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs text-gray-700 dark:text-gray-300">
                    {business.primaryCategory || "Uncategorized"}
                  </span>
                  {business.city && <span>• {business.city}</span>}
                </p>
                {business.tagline && <p className="text-gray-800 dark:text-gray-300 italic mt-3 text-lg">"{business.tagline}"</p>}
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-bold transition-all shadow-md shadow-yellow-400/20">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Info) */}
          <div className="space-y-6">
            
            {/* About Section */}
            <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="text-yellow-500" /> About
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {business.description || "No description provided yet."}
              </p>
            </div>

            {/* Contact & Location */}
            <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Contact & Info</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{business.phone || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                      {business.address ? `${business.address}, ${business.city}, ${business.state}` : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Features */}
            {business.amenities && business.amenities.length > 0 && (
              <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Check className="text-yellow-500" /> Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.amenities.map((amenity: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Posts Feed) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 px-2">
              <LayoutGrid className="text-yellow-500" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Recent Posts</h2>
            </div>

            {posts.length === 0 && !loadingPosts ? (
              <div className="bg-white dark:bg-[#242424] rounded-[32px] p-10 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-500">This business hasn't shared any updates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => {
                  const isLast = index === posts.length - 1;
                  // Inject business object if missing to render properly in PostCard
                  const populatedPost = {
                    ...post,
                    business: post.business || business
                  };

                  return (
                    <div ref={isLast ? lastPostElementRef : null} key={post.id}>
                      <PostCard
                        post={populatedPost}
                        onLike={toggleLike}
                        onCommentClick={fetchComments}
                      >
                        {/* Comments Section */}
                        {activeComments[post.id] && (
                          <div className="px-4 pb-4">
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                              {activeComments[post.id].length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-2 font-bold">No comments yet.</p>
                              ) : (
                                activeComments[post.id].map((comment: any) => (
                                  <div key={comment.id} className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                                      <span className="w-full h-full flex items-center justify-center text-xs font-black text-gray-500">{comment.user.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl px-4 py-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.user.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="flex items-center gap-3 pt-3">
                              <input 
                                type="text" 
                                value={commentText[post.id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                placeholder="Write a comment..." 
                                className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-full py-2.5 px-4 text-sm focus:outline-none border border-gray-200 dark:border-gray-800 focus:border-yellow-400 transition-colors"
                              />
                            </div>
                          </div>
                        )}
                      </PostCard>
                    </div>
                  );
                })}
                {loadingPosts && <div className="text-center py-4 text-gray-500 font-bold">Loading...</div>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
