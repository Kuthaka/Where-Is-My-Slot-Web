"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Zap, Loader2, CheckCircle2, Link as LinkIcon, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

interface CreateFlashDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlashDealCreated?: (deal: any) => void;
  business?: any;
}

const DEAL_TYPES = ["DISCOUNT", "NEW_ARRIVAL", "EVENT", "ANNOUNCEMENT"];

export default function CreateFlashDealModal({ isOpen, onClose, onFlashDealCreated, business }: CreateFlashDealModalProps) {
  const [offer, setOffer] = useState("");
  const [type, setType] = useState("DISCOUNT");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [navigateLink, setNavigateLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageUrl || !offer.trim()) {
      toast.error("Image and offer text are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        offer,
        type,
        image: imageUrl,
        ...(navigateLink && { navigateLink }),
      };
      const res = await fetch("http://localhost:5000/api/v1/flash-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create flash deal");

      toast.success("Flash Deal published successfully! ⚡");
      onFlashDealCreated?.(data.data ?? data);
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOffer("");
    setType("DISCOUNT");
    setImageUrl("");
    setImagePreview(null);
    setNavigateLink("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-[500px] bg-white dark:bg-[#1e1e1e] rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 to-red-500 text-white flex items-center justify-center">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">
                Create Flash Deal
              </p>
              <p className="text-xs text-gray-400 font-medium">Stories disappear in 24 hours</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 hover:bg-gray-200 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <ImageIcon size={16} className="text-yellow-500" /> Background Image
            </label>
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-400/5 transition-all group"
              >
                <ImageIcon size={28} className="text-gray-400 group-hover:text-yellow-500" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-yellow-500">Upload Story Image (9:16 recommended)</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1a1a1a] flex justify-center h-48">
                <img src={imagePreview} alt="Preview" className="h-full object-cover" />
                <button
                  onClick={() => { setImagePreview(null); setImageUrl(""); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Offer Text */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" /> Offer Text
            </label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="e.g., Happy Hour 1+1 🍹"
              maxLength={30}
              className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Type Select */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <Tag size={16} className="text-blue-500" /> Deal Type
            </label>
            <div className="flex flex-wrap gap-2">
              {DEAL_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    type === t 
                      ? "bg-black text-white dark:bg-white dark:text-black" 
                      : "bg-gray-100 text-gray-500 dark:bg-[#2a2a2a] hover:bg-gray-200"
                  }`}
                >
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <LinkIcon size={16} className="text-green-500" /> Navigate Link (Optional)
            </label>
            <input
              type="url"
              value={navigateLink}
              onChange={(e) => setNavigateLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-[10px] text-gray-400 mt-1.5 font-bold">This will add a 'Navigate' button to your story.</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-[#1e1e1e]">
          <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !imageUrl || !offer.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
            Post Flash Deal
          </button>
        </div>
      </div>
    </div>
  );
}
