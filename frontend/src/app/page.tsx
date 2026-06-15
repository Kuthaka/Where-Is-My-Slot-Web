"use client";

import Header from "@/components/Header";
import LeftSidebar from "@/components/Home/LeftSidebar";
import RightSidebar from "@/components/Home/RightSidebar";
import FeedArea from "@/components/Home/FeedArea";

export default function AppLandingPage() {
  return (
    <div className="h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-6 pt-[96px] px-4 lg:px-8 h-full overflow-hidden">
        <LeftSidebar />
        <FeedArea />
        <RightSidebar />
      </main>
    </div>
  );
}
