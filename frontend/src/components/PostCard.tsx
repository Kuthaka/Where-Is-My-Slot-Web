import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark, CheckCircle2 } from "lucide-react";
import React from "react";

interface PostCardProps {
  post: any;
  onLike?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
  onShare?: (postId: string) => void;
  renderMenu?: () => React.ReactNode;
  children?: React.ReactNode;
  hideCaption?: boolean;
}

function getShortTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${Math.max(1, diffMins)}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

export default function PostCard({ post, onLike, onCommentClick, onShare, renderMenu, children, hideCaption }: PostCardProps) {
  const username = post.business?.username || post.business?.name?.toLowerCase().replace(/\s+/g, '');

  return (
    <article className="bg-white dark:bg-[#242424] rounded-[28px] overflow-hidden w-full mb-6 border border-gray-100 dark:border-gray-800 shadow-sm pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-[#242424] bg-gray-100 dark:bg-gray-800">
              {post.business?.logo ? (
                <img src={post.business.logo} alt={post.business.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-gray-500 bg-gray-100 dark:bg-gray-800">
                  {post.business?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white hover:opacity-70 cursor-pointer">
              {username}
            </span>
            {post.business?.isVerified && <CheckCircle2 size={12} className="text-blue-500 fill-current" />}
            <span className="text-gray-400 dark:text-gray-500 mx-1">•</span>
            <span className="text-gray-400 dark:text-gray-500 text-[14px]">{getShortTime(post.createdAt)}</span>
          </div>
        </div>
        
        {renderMenu ? (
          renderMenu()
        ) : (
          <button className="text-gray-900 dark:text-white p-2">
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>

      {/* Image (Edge to edge) */}
      {post.image && (
        <div className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-y border-gray-100 dark:border-gray-800/50 flex items-center justify-center overflow-hidden">
          <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[800px]" />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => onLike?.(post.id)} className="hover:opacity-60 transition-opacity">
            <Heart size={24} fill={post.isLikedByMe ? "#ff3040" : "none"} color={post.isLikedByMe ? "#ff3040" : "currentColor"} className="text-gray-900 dark:text-white" />
          </button>
          <button onClick={() => onCommentClick?.(post.id)} className="hover:opacity-60 transition-opacity">
            <MessageCircle size={24} className="text-gray-900 dark:text-white" />
          </button>
          <button onClick={() => onShare?.(post.id)} className="hover:opacity-60 transition-opacity">
            <Send size={24} className="text-gray-900 dark:text-white -rotate-12 mt-[-4px]" />
          </button>
        </div>
        <button className="hover:opacity-60 transition-opacity">
          <Bookmark size={24} className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Likes */}
      <div className="px-3 pb-1 text-[14px] font-semibold text-gray-900 dark:text-white">
        {post._count?.likes || 0} likes
      </div>

      {/* Caption */}
      {!hideCaption && post.text && (
        <div className="px-3 pb-2 text-[14px] text-gray-900 dark:text-white leading-[18px]">
          <span className="font-semibold mr-1.5">{username}</span>
          <span className="whitespace-pre-wrap">{post.text}</span>
        </div>
      )}
      
      {/* Dynamic Children (e.g., Comments section) */}
      {children}
    </article>
  );
}
