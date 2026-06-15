import { Home, Search, Map, PlusSquare, Wallet, User, Bell, Menu, LayoutDashboard, Store } from "lucide-react";

export default function SideNav() {
  return (
    <div className="hidden md:flex flex-col w-[72px] lg:w-[244px] fixed left-0 top-0 h-screen border-r border-gray-200 bg-white p-3 pt-8 pb-5 justify-between z-50">
      <div>
        <div className="px-3 mb-10 flex items-center justify-center lg:justify-start">
          <h1 className="hidden lg:block text-[22px] font-black text-gray-900 tracking-tighter italic">WhereIsMySlot</h1>
          <div className="lg:hidden w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold italic shadow-sm">S</div>
        </div>
        <nav className="flex flex-col gap-1.5">
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 font-bold transition-colors group">
            <Home size={24} strokeWidth={2.5} className="text-gray-900 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Home</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <Search size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Search</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <Map size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Explore Map</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <Bell size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Notifications</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <PlusSquare size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Create</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <LayoutDashboard size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
            <User size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block text-[15px]">Profile</span>
          </a>
          <a href="/business/register" className="flex items-center gap-4 px-3 py-3 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-900 transition-colors group relative mt-2">
            <Store size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform text-yellow-700" />
            <span className="hidden lg:flex flex-col">
              <span className="text-[15px] font-bold">List your business</span>
            </span>
            <span className="hidden lg:flex absolute -right-2 -top-2 bg-green-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-md rotate-12 uppercase tracking-wider border border-green-400">FREE</span>
          </a>
        </nav>
      </div>
      <div>
        <a href="#" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 text-gray-900 transition-colors group">
          <Menu size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
          <span className="hidden lg:block text-[15px]">More</span>
        </a>
      </div>
    </div>
  );
}
