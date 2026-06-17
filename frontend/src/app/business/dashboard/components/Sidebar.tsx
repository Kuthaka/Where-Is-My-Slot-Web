"use client";

import { Store, LayoutDashboard, FileText, Gift, Car, Building2, LogOut, Shield } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export default function BusinessSidebar({ activeTab, setActiveTab, handleLogout }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/business/dashboard" },
    { id: "posts", label: "Posts", icon: FileText, href: "/business/dashboard/posts" },
    { id: "offers", label: "Offers", icon: Gift, href: "/business/dashboard/offers" },
    { id: "parking", label: "Parking", icon: Car, href: "/business/dashboard/parking" },
    { id: "profile", label: "Profile", icon: Building2, href: "/business/dashboard/profile" },
    { id: "security", label: "Security", icon: Shield, href: "/business/dashboard/security" },
  ];

  return (
    <aside className="hidden lg:flex w-[320px] flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-8">
      <div className="bg-white dark:bg-[#242424] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0">
        <Link href="/" className="bg-yellow-400 p-2.5 rounded-xl text-black shadow-lg shadow-yellow-400/20 hover:scale-105 transition-transform cursor-pointer">
          <Store size={22} />
        </Link>
        <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">Merchant Hub</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-gray-100 dark:bg-[#242424] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-white border border-transparent"
              }`}
            >
              <Icon size={20} className={isActive ? "text-yellow-500" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
