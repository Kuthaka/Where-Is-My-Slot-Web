import Image from "next/image";

export default function RightPanel() {
  return (
    <div className="w-full h-screen sticky top-0 pt-10 pb-8 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Current User */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
             <Image unoptimized src="https://ui-avatars.com/api/?name=User&background=111827&color=fff" alt="Profile" width={48} height={48} />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">current_user</div>
            <div className="text-sm text-gray-500">My Name</div>
          </div>
        </div>
        <button className="text-xs font-bold text-purple-600 hover:text-purple-900">Switch</button>
      </div>

      {/* Suggested */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-gray-500">Suggested for you</span>
        <button className="text-xs font-bold text-gray-900 hover:text-gray-500">See all</button>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { name: "shefna_p ✨", sub: "Followed by user1 + 3 more", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
          { name: "Muhammed Shahinsha", sub: "Followed by user2", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
          { name: "ur_mami._.yani", sub: "New to My Slot", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
          { name: "F@rs@n@", sub: "Followed by user3", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100">
                <Image unoptimized src={item.img} alt={item.name} width={44} height={44} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-[140px]">{item.sub}</div>
              </div>
            </div>
            <button className="text-xs font-bold text-purple-600 hover:text-purple-900">Follow</button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-xs text-gray-400">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Press</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Locations</a>
        </nav>
        <div>© 2026 WHERE IS MY SLOT</div>
      </div>
    </div>
  );
}
