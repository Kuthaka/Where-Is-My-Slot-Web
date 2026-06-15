"use client";

import { CheckCircle2, MapPin, Link as LinkIcon, Calendar, Image as ImageIcon, Gift, MoreHorizontal, Heart, MessageCircle, Share2, BarChart2, Trash2, Store } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function OverviewTab({ business, user }: { business: any, user?: any }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  
  // Comments state
  const [activeComments, setActiveComments] = useState<{ [key: string]: any[] }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = async (cursor?: string) => {
    if (loading || (!hasMore && cursor)) return;
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (business?.id) {
      fetchPosts();
    }
  }, [business?.id]);

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

  const handlePost = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setText("");
        toast.success("Posted successfully!");
        fetchPosts(); // Refresh from start
      } else {
        toast.error(data.message?.message || data.message || "Failed to post");
      }
    } catch (err) {
      toast.error("Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = async (postId: string) => {
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
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
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

  const handleEditPost = async (postId: string) => {
    if (!editText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: editText })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, text: editText } : p));
        setEditingPostId(null);
        toast.success("Post updated!");
      }
    } catch (err) {
      toast.error("Failed to update post");
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
      const token = localStorage.getItem("token");
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

  if (!business) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
          {business.coverPhoto && <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
        </div>
        <div className="px-6 pb-6 pt-3 relative">
          <div className="flex justify-between items-start">
            <div className="absolute -top-16 border-4 border-white dark:border-[#242424] w-32 h-32 rounded-full bg-white dark:bg-[#1a1a1a] shadow-md overflow-hidden flex items-center justify-center">
              {business.logo ? (
                <img src={business.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-gray-300">{business.name?.charAt(0)}</span>
              )}
            </div>
          </div>
          <div className="mt-16">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              {business.name}
              {business.isVerified && <CheckCircle2 className="text-blue-500 w-5 h-5" fill="currentColor" stroke="white" />}
            </h1>
            <p className="text-gray-500 font-medium">@{business.username || business.name.toLowerCase().replace(/\\s+/g, '')}</p>
          </div>
          <div className="mt-4 text-gray-900 dark:text-gray-100 leading-relaxed text-[15px]">
            {business.description || business.tagline || "Welcome to our official business page!"}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="bg-white dark:bg-[#242424] rounded-[32px] p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] shrink-0 overflow-hidden flex items-center justify-center">
          {business.logo ? <img src={business.logo} alt="Logo" className="w-full h-full object-cover" /> : <Store size={20} />}
        </div>
        <div className="flex-1">
          <textarea 
            placeholder="What's happening?" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-xl placeholder-gray-500 text-gray-900 dark:text-white min-h-[60px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
            <div className="flex items-center gap-2 text-yellow-500">
              <button className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
            </div>
            <button 
              onClick={handlePost} 
              disabled={isSubmitting || !text.trim()}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          return (
            <div 
              key={post.id} 
              ref={isLast ? lastPostElementRef : null}
              className="bg-white dark:bg-[#242424] rounded-[32px] p-5 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden shrink-0 flex items-center justify-center">
                    {post.business.logo ? <img src={post.business.logo} alt="Logo" className="w-full h-full object-cover" /> : <Store size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 dark:text-white hover:underline">{post.business.name}</span>
                      {post.business.isVerified && <CheckCircle2 className="text-blue-500 w-4 h-4" fill="currentColor" stroke="white" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span>@{post.business.username || post.business.name.toLowerCase().replace(/\\s+/g, '')}</span>
                      <span>·</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="relative group/menu">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                    <MoreHorizontal size={20} />
                  </button>
                  <div className="absolute right-0 top-10 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl w-32 py-2 hidden group-hover/menu:block z-10">
                    <button 
                      onClick={() => {
                        setEditingPostId(post.id);
                        setEditText(post.text);
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#242424] flex items-center gap-2"
                    >
                      <MoreHorizontal size={16} /> Edit
                    </button>
                    <button onClick={() => deletePost(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {editingPostId === post.id ? (
                  <div className="space-y-3">
                    <textarea 
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-3 min-h-[100px] text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingPostId(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                      <button onClick={() => handleEditPost(post.id)} className="px-4 py-2 text-sm font-bold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-[15px] leading-normal">{post.text}</p>
                )}
                {post.image && !editingPostId && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <img src={post.image} alt="Media" className="w-full h-auto object-cover max-h-[400px]" />
                  </div>
                )}
              </div>

              {/* Engagement Action Bar */}
              <div className="flex items-center justify-between mt-5 pt-1 text-gray-500 max-w-md">
                <button 
                  onClick={() => fetchComments(post.id)}
                  className={`flex items-center gap-2 transition-colors group ${activeComments[post.id] ? 'text-blue-500' : 'hover:text-blue-500'}`}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10">
                    <MessageCircle size={18} fill={activeComments[post.id] ? "currentColor" : "none"} />
                  </div>
                  <span className="text-xs font-bold">{post._count?.comments || 0}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-500/10"><Share2 size={18} /></div>
                </button>
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors group ${post.isLikedByMe ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-500/10">
                    <Heart size={18} fill={post.isLikedByMe ? "currentColor" : "none"} />
                  </div>
                  <span className="text-xs font-bold">{post._count?.likes || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeComments[post.id] && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-3 no-scrollbar">
                    {activeComments[post.id].length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2 font-bold">No comments yet.</p>
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
                            <button 
                              onClick={() => deleteComment(post.id, comment.id)}
                              className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover/comment:block transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                        placeholder="Write a comment..." 
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none border border-gray-200 dark:border-gray-800 focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {loading && <div className="text-center py-4 text-gray-500 font-bold">Loading...</div>}
        {!hasMore && posts.length > 0 && <div className="text-center py-4 text-gray-500 font-bold">You've reached the end!</div>}
      </div>
    </div>
  );
}
