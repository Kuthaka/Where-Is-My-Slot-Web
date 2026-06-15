"use client";

import { useState, useRef, useCallback } from "react";
import { X, Image as ImageIcon, MapPin, Tag, Zap, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: any) => void;
  business?: any;
}

const CATEGORY_TAGS = [
  "Flash Deal", "New Arrival", "Event", "Happy Hour", "Weekend Special",
  "Limited Offer", "Seasonal Sale", "New Menu", "Grand Opening", "Giveaway",
  "Partnership", "Behind The Scenes", "Customer Love", "Announcement"
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated, business }: CreatePostModalProps) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags(prev => [...prev, trimmed]);
      setCustomTag("");
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url || null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      // For now, store as base64 (you can swap with S3/upload endpoint)
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Please write a caption for your post.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        text: caption,
        tags: selectedTags,
        ...(imageUrl && { image: imageUrl }),
        ...(location && { location }),
      };
      const res = await fetch("http://localhost:5000/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");

      toast.success("Post published successfully! 🎉");
      onPostCreated?.(data.data ?? data);
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCaption("");
    setImageUrl("");
    setImagePreview(null);
    setLocation("");
    setSelectedTags([]);
    setShowTagsPanel(false);
    setCustomTag("");
    setImageMode("url");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[560px] bg-white dark:bg-[#1e1e1e] rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            {business?.logo ? (
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-2xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-500 flex items-center justify-center">
                <Zap size={20} />
              </div>
            )}
            <div>
              <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">
                {business?.name || "Your Business"}
              </p>
              <p className="text-xs text-gray-400 font-medium">Create a new offer post</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          {/* Caption */}
          <div className="px-6 pt-5 pb-2">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's your offer today? Share a deal, announce an event, or post an update..."
              rows={4}
              className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs font-bold ${caption.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                {caption.length}/500
              </span>
            </div>
          </div>

          {/* Image Section */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={16} className="text-yellow-500" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Add Image</span>
              <div className="flex bg-gray-100 dark:bg-[#2a2a2a] rounded-full p-1 ml-auto gap-1">
                <button
                  onClick={() => setImageMode("url")}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${imageMode === "url" ? "bg-yellow-400 text-black shadow-sm" : "text-gray-500"}`}
                >
                  URL
                </button>
                <button
                  onClick={() => setImageMode("upload")}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${imageMode === "upload" ? "bg-yellow-400 text-black shadow-sm" : "text-gray-500"}`}
                >
                  Upload
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-400/5 transition-all group"
              >
                <ImageIcon size={24} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-yellow-500 transition-colors">
                  Click to upload image
                </span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                <img src={imagePreview} alt="Preview" className="w-full max-h-[220px] object-cover" />
                <button
                  onClick={() => { setImagePreview(null); setImageUrl(""); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Image ready
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Location</span>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add a location (e.g. Koramangala, Bengaluru)"
              className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Tags */}
          <div className="px-6 pb-5">
            <button
              onClick={() => setShowTagsPanel(!showTagsPanel)}
              className="w-full flex items-center justify-between gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >
              <span className="flex items-center gap-2">
                <Tag size={16} className="text-purple-500" />
                Tags
                {selectedTags.length > 0 && (
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </span>
              {showTagsPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Selected tags chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                    <button onClick={() => handleTagToggle(tag)} className="hover:text-red-500 transition-colors ml-1">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {showTagsPanel && (
              <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-yellow-400 hover:text-yellow-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
                    placeholder="Custom tag..."
                    className="flex-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#1e1e1e]">
          <div className="flex gap-4 text-gray-400">
            <button onClick={() => setImageMode("upload")} className="hover:text-yellow-500 transition-colors p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-400/10 rounded-lg" title="Add image">
              <ImageIcon size={20} />
            </button>
            <button onClick={() => setShowTagsPanel(!showTagsPanel)} className="hover:text-purple-500 transition-colors p-1.5 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg" title="Add tags">
              <Tag size={20} />
            </button>
            <button className="hover:text-blue-500 transition-colors p-1.5 hover:bg-blue-50 dark:hover:bg-blue-400/10 rounded-lg" title="Add location">
              <MapPin size={20} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !caption.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-black bg-yellow-400 hover:bg-yellow-500 transition-all shadow-md shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
