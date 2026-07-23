"use client";

import {
  CheckCircle2, MapPin, MoreHorizontal, Store, Plus, Zap,
  Edit2, FileText, Flame, ChevronRight, Eye, Heart, MessageCircle,
  Image as ImageIcon, Clock, TrendingUp, Users, Star, BadgeCheck
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import { useModal } from "@/components/ModalProvider";
import { useDashboard } from "../layout";
import Link from "next/link";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`bg-white dark:bg-[#242424] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Flash Deal Horizontal Card ───────────────────────────────────────────────
function FlashDealCard({ deal }: { deal: any }) {
  return (
    <div className="w-56 shrink-0 bg-white dark:bg-[#242424] rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 p-3 flex flex-col justify-end">
        <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full w-max">
          <Zap size={10} /> FLASH DEAL
        </span>
        <p className="text-sm font-black text-white mt-1 leading-tight line-clamp-2">{deal.title || "Special Offer"}</p>
      </div>
      <div className="px-3 py-3">
        <p className="text-xs text-gray-500 line-clamp-2">{deal.text || "Limited time offer!"}</p>
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400">
          <Heart size={10} /> {deal._count?.likes || 0}
          <MessageCircle size={10} className="ml-1" /> {deal._count?.comments || 0}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Post Row ────────────────────────────────────────────────────────────
function MiniPostRow({ post }: { post: any }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 group hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a]/50 rounded-xl px-2 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-400 overflow-hidden">
        {post.images?.[0] ? <img src={post.images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.text || "Post"}</p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-gray-400 shrink-0">
        <span className="flex items-center gap-1"><Heart size={12} /> {post._count?.likes || 0}</span>
        <span className="flex items-center gap-1"><MessageCircle size={12} /> {post._count?.comments || 0}</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OverviewTab({ business, user }: { business: any; user?: any }) {
  const { setBusiness } = useDashboard();
  const [posts, setPosts] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showModal } = useModal();
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [activeComments, setActiveComments] = useState<{ [key: string]: any[] }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = async (cursor?: string) => {
    if (loading || (!hasMore && cursor)) return;
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/v1/posts?limit=10&businessId=${business.id}${cursor ? "&cursor=" + cursor : ""}${user?.id ? "&userId=" + user.id : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        const allPosts = cursor ? [...posts, ...data.data.posts] : data.data.posts;
        if (!cursor) {
          // Separate flash deals from regular posts
          setFlashDeals(allPosts.filter((p: any) => p.isFlashDeal).slice(0, 6));
          setPosts(allPosts);
        } else {
          setPosts(allPosts);
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
    if (business?.id) fetchPosts();
  }, [business?.id, user?.id]);

  const lastPostElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchPosts(nextCursor!);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, nextCursor]);

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
    if (newPost.isFlashDeal) setFlashDeals(prev => [newPost, ...prev].slice(0, 6));
    setIsModalOpen(false);
  };

  const toggleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev =>
          prev.map(p =>
            p.id === postId
              ? { ...p, _count: { ...p._count, likes: data.data.isLiked ? p._count.likes + 1 : p._count.likes - 1 }, isLikedByMe: data.data.isLiked }
              : p
          )
        );
      }
    } catch {}
  };

  const deletePost = async (postId: string) => {
    showModal({
      title: "Delete Post",
      message: "Are you sure you want to delete this post?",
      type: "confirm",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setPosts(prev => prev.filter(p => p.id !== postId));
            setFlashDeals(prev => prev.filter(p => p.id !== postId));
            toast.success("Post deleted");
          }
        } catch {}
      },
    });
  };

  const handleEditPost = async (postId: string) => {
    if (!editText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: editText }),
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, text: editText } : p)));
        setEditingPostId(null);
        toast.success("Post updated!");
      }
    } catch { toast.error("Failed to update post"); }
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
      if (res.ok) setActiveComments(prev => ({ ...prev, [postId]: data.data || data }));
    } catch {}
  };

  const handleCommentSubmit = async (postId: string) => {
    const txt = commentText[postId]?.trim();
    if (!txt) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: txt }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } } : p));
        if (activeComments[postId]) setActiveComments(prev => ({ ...prev, [postId]: [...prev[postId], data.data || data] }));
      }
    } catch {}
  };

  const deleteComment = async (postId: string, commentId: string) => {
    showModal({
      title: "Delete Comment", message: "Delete this comment?", type: "confirm", confirmText: "Delete",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/api/v1/posts/comments/${commentId}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, comments: Math.max(0, p._count.comments - 1) } } : p));
            setActiveComments(prev => ({ ...prev, [postId]: prev[postId].filter((c: any) => c.id !== commentId) }));
          }
        } catch {}
      },
    });
  };

  if (!business) return null;

  const recentPosts = posts.slice(0, 5);

  // Open today's hours
  const todayKey = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayHours = business.timings?.[todayKey];
  const todayLabel = todayHours?.closed ? "Closed Today" : todayHours ? `Open: ${todayHours.open} – ${todayHours.close}` : "Hours not set";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

      {/* ── Profile Hero Card ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="h-44 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
          {business.coverPhoto && <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
          {/* Status */}
          <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow ${
            business.status === "APPROVED" ? "bg-green-500 text-white" : business.status === "REJECTED" ? "bg-red-500 text-white" : "bg-white text-yellow-700"
          }`}>
            {business.status === "APPROVED" ? "✓ Live" : business.status === "REJECTED" ? "Rejected" : "⏳ Pending"}
          </span>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-3 relative z-10">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#242424] bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden flex items-center justify-center shrink-0">
              {business.logo
                ? <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
                : <span className="text-3xl font-black text-gray-300">{business.name?.charAt(0)}</span>}
            </div>
            <Link
              href="/business/dashboard/profile/edit"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-black text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl transition-colors border border-gray-200 dark:border-gray-800 mb-2"
            >
              <Edit2 size={15} /> Edit Profile
            </Link>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {business.name}
            {business.isVerified && <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" fill="currentColor" stroke="white" />}
          </h1>
          {business.tagline && <p className="text-gray-500 italic text-sm mt-1">"{business.tagline}"</p>}

          {/* Quick info row */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-gray-500">
            {business.primaryCategory && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                {business.primaryCategory}
              </span>
            )}
            {business.city && (
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-yellow-500" /> {business.city}</span>
            )}
            {!todayHours?.closed && todayHours && (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400"><Clock size={12} /> {todayLabel}</span>
            )}
            {todayHours?.closed && (
              <span className="flex items-center gap-1.5 text-red-500"><Clock size={12} /> Closed Today</span>
            )}
            {business.establishedYear && (
              <span className="flex items-center gap-1.5"><BadgeCheck size={12} className="text-blue-500" /> Est. {business.establishedYear}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Posts" value={posts.length} icon={<FileText size={20} />} color="bg-blue-50 dark:bg-blue-900/20 text-blue-500" />
        <StatCard label="Flash Deals" value={flashDeals.length} icon={<Zap size={20} />} color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500" />
        <StatCard label="Total Likes" value={posts.reduce((s, p) => s + (p._count?.likes || 0), 0)} icon={<Heart size={20} />} color="bg-red-50 dark:bg-red-900/20 text-red-400" />
        <StatCard label="Amenities" value={business.amenities?.length || 0} icon={<Star size={20} />} color="bg-purple-50 dark:bg-purple-900/20 text-purple-500" />
      </div>

      {/* ── Post Composer ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#1a1a1a] shrink-0 overflow-hidden flex items-center justify-center">
            {business.logo ? <img src={business.logo} alt="Logo" className="w-full h-full object-cover" /> : <Store size={18} />}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-full px-5 py-3 text-gray-400 font-medium text-sm transition-all"
          >
            Share an update, offer, or deal...
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/30 transition-all hover:scale-105"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-gray-500">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm font-bold hover:text-yellow-500 transition-colors">
            <ImageIcon size={15} className="text-yellow-500" /> Photo
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm font-bold hover:text-blue-500 transition-colors">
            <MapPin size={15} className="text-blue-500" /> Location
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm font-bold hover:text-purple-500 transition-colors">
            <Zap size={15} className="text-purple-500" /> Flash Deal
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
        business={business}
      />

      {/* ── Flash Deals (horizontal scroll) ─────────────────────────── */}
      {flashDeals.length > 0 && (
        <div className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" /> Flash Deals
            </h3>
            <Link href="/business/dashboard/posts" className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {flashDeals.map(deal => <FlashDealCard key={deal.id} deal={deal} />)}
          </div>
        </div>
      )}

      {/* ── Recent Posts (last 5) ────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-blue-500" /> Recent Posts
          </h3>
          <span className="text-xs font-bold text-gray-400">{Math.min(posts.length, 5)} of {posts.length}</span>
        </div>
        <div className="px-4">
          {recentPosts.length === 0 && !loading ? (
            <div className="py-10 text-center">
              <p className="text-gray-500 text-sm font-bold">No posts yet. Create your first one above!</p>
            </div>
          ) : (
            recentPosts.map(post => <MiniPostRow key={post.id} post={post} />)
          )}
          {loading && <div className="py-6 text-center text-gray-400 text-sm font-bold">Loading...</div>}
        </div>
        {posts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/business/dashboard/posts"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-xl transition-colors border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-800"
            >
              View All Posts <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Full Feed (full PostCards, infinite scroll) ───────────────── */}
      <div className="space-y-4">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          return (
            <div ref={isLast ? lastPostElementRef : null} key={post.id}>
              <PostCard
                post={post}
                onLike={toggleLike}
                onCommentClick={fetchComments}
                onShare={() => {}}
                hideCaption={editingPostId === post.id}
                renderMenu={() => (
                  <div className="relative group/menu">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                      <MoreHorizontal size={20} />
                    </button>
                    <div className="absolute right-0 top-10 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl w-32 py-2 hidden group-hover/menu:block z-10">
                      <button
                        onClick={() => { setEditingPostId(post.id); setEditText(post.text); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#242424] flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => deletePost(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              >
                {editingPostId === post.id && (
                  <div className="px-3 pb-3">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-3 min-h-[100px] text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 text-[14px]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingPostId(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                      <button onClick={() => handleEditPost(post.id)} className="px-4 py-2 text-sm font-bold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500">Save</button>
                    </div>
                  </div>
                )}
                {activeComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                      {activeComments[post.id].length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2 font-bold">No comments yet.</p>
                      ) : (
                        activeComments[post.id].map((comment: any) => (
                          <div key={comment.id} className="flex gap-3 items-start group/comment">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 flex items-center justify-center">
                              <span className="text-xs font-black text-gray-500">{comment.user.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl px-4 py-2 relative">
                              <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.user.name}</span>
                              <span className="text-[10px] text-gray-400 font-bold ml-2">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
                              <button onClick={() => deleteComment(post.id, comment.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover/comment:block transition-colors">🗑</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="text"
                        value={commentText[post.id] || ""}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-full py-2.5 pl-4 pr-4 text-sm focus:outline-none border border-gray-200 dark:border-gray-800 focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </PostCard>
            </div>
          );
        })}
        {loading && <div className="text-center py-4 text-gray-500 font-bold text-sm">Loading more...</div>}
        {!hasMore && posts.length > 0 && <div className="text-center py-4 text-gray-500 font-bold text-sm">You've seen all posts ✓</div>}
      </div>
    </div>
  );
}
