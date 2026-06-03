import { MoreHorizontal, Heart, Send, Bookmark, MapPin } from "lucide-react";
import Image from "next/image";

interface PostProps {
  storeName: string;
  distance: string;
  location: string;
  storeImage: string;
  postImage: string;
  title: string;
  description: string;
  badge?: string;
  timeInfo?: string;
}

export default function Post({ storeName, distance, location, storeImage, postImage, title, description, badge, timeInfo }: PostProps) {
  return (
    <div className="bg-white mb-6 pb-6 border-b border-gray-200 last:border-0 md:border md:rounded-xl md:mb-8 md:pb-4 md:shadow-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <Image unoptimized src={storeImage} alt={storeName} width={42} height={42} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-[15px] text-gray-900 leading-tight">{storeName}</h3>
            <div className="flex items-center text-xs font-medium text-gray-500 mt-0.5">
              <MapPin size={12} className="mr-1" />
              <span>{distance} • {location}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-900 transition-colors">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden sm:rounded-sm md:rounded-none">
        <Image unoptimized src={postImage} alt={title} fill className="object-cover" />
        {badge && (
          <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-sm tracking-wide">
            {badge}
          </div>
        )}
        {timeInfo && (
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
            {timeInfo}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-5">
          <button className="text-gray-800 hover:text-red-500 transition-transform active:scale-90">
            <Heart size={26} strokeWidth={1.5} />
          </button>
          <button className="text-gray-800 hover:text-blue-500 transition-transform active:scale-90 -rotate-[15deg]">
            <Send size={26} strokeWidth={1.5} />
          </button>
        </div>
        <button className="text-gray-800 hover:text-purple-600 transition-transform active:scale-90">
          <Bookmark size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="px-5">
        <h4 className="font-extrabold text-[17px] text-gray-900 mb-1.5">{title}</h4>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-5 font-medium">{description}</p>
        
        <div className="flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl text-sm transition-colors border border-gray-200 shadow-sm">
            <Bookmark size={18} strokeWidth={2} />
            Save Offer
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md shadow-purple-600/20">
            <Send size={18} strokeWidth={2} className="-rotate-[15deg]" />
            Navigate
          </button>
        </div>
      </div>
    </div>
  );
}
