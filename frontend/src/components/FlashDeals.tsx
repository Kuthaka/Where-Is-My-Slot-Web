import Image from "next/image";

const DEALS = [
  { id: 1, name: "Third Wave", time: "45m", color: "bg-purple-600", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop" },
  { id: 2, name: "Zara", time: "2h", color: "bg-purple-600", img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop" },
  { id: 3, name: "Tali", time: "15m", color: "bg-purple-600", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop" },
  { id: 4, name: "Truffles", time: "34m", color: "bg-purple-600", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop" },
  { id: 5, name: "Cult", time: "", color: "bg-gray-400", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop" },
];

export default function FlashDeals() {
  return (
    <div className="py-5 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-5 mb-4">
        <h2 className="font-extrabold text-lg text-gray-900 tracking-tight">Flash Deals</h2>
        <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md tracking-wide">Live Now</span>
      </div>
      <div className="flex overflow-x-auto gap-5 px-5 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {DEALS.map((deal) => (
          <div key={deal.id} className="flex flex-col items-center gap-1.5 min-w-[76px] cursor-pointer group">
            <div className="relative">
              <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${deal.time ? 'bg-gradient-to-tr from-purple-600 to-pink-500' : 'bg-gray-200'}`}>
                <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white">
                  <Image unoptimized src={deal.img} alt={deal.name} width={70} height={70} className="w-full h-full object-cover" />
                </div>
              </div>
              {deal.time && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-[1.5px] border-white shadow-sm">
                  {deal.time}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-700 truncate w-full text-center mt-2 group-hover:text-purple-600 transition-colors">{deal.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
