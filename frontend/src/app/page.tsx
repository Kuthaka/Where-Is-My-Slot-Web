import Header from "@/components/Header";
import FlashDeals from "@/components/FlashDeals";
import Post from "@/components/Post";
import MerchantHub from "@/components/MerchantHub";
import { Store } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import SideNav from "@/components/SideNav";
import RightPanel from "@/components/RightPanel";

export default function Home() {
  return (
    <div className="bg-gray-50 md:bg-white min-h-screen text-gray-900 font-sans">
      <SideNav />
      <Header />
      
      <main className="md:ml-[72px] lg:ml-[244px] flex justify-center min-h-screen pt-2 md:pt-10 pb-20 md:pb-8 w-full md:w-[calc(100%-72px)] lg:w-[calc(100%-244px)]">
        {/* Main Content Wrapper */}
        <div className="w-full max-w-[820px] flex md:justify-center xl:justify-between px-0 sm:px-4 xl:px-8 gap-16">
          {/* Center Feed Column */}
          <div className="w-full max-w-lg xl:max-w-[470px] flex flex-col shrink-0">
            <FlashDeals />
            
            <div className="flex flex-col mt-2 md:mt-0">
              <Post 
                storeName="Social Offline"
                distance="150m away"
                location="Indiranagar"
                storeImage="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop"
                postImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=750&fit=crop"
                title="Happy Hour Special 🍹"
                description="Get 1+1 on all cocktails until 8 PM today. Show this screen at the counter to redeem."
                badge="FLAT 50% OFF"
                timeInfo="Open Now • Closes 1 AM"
              />
              
              <Post 
                storeName="Used Car Store"
                distance="300m away"
                location="Brigade Road"
                storeImage="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
                postImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=750&fit=crop"
                title="Air Jordan 1 High OG 👟"
                description="Limited stock available in-store. Reserve your pair now before they run out."
                badge="NEW DROP"
              />
              
              <Post 
                storeName="Cult Fit"
                distance="500m away"
                location="Koramangala"
                storeImage="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop"
                postImage="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=750&fit=crop"
                title="Weekend Bootcamp 🏋️‍♂️"
                description="Join our intense weekend bootcamp and get 20% off on your first month subscription."
                timeInfo="Starts Tomorrow • 7 AM"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="hidden xl:block w-[320px] shrink-0 relative">
            <RightPanel />
          </div>
        </div>
      </main>

      {/* <MerchantHub /> */}
      
      {/* Mobile Floating 'List your business' Button */}
      <div className="md:hidden fixed bottom-24 right-4 z-40 flex items-center justify-end">
        <a href="/list-business" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full flex items-center justify-center p-4 shadow-lg shadow-yellow-400/40 border border-yellow-300 transition-transform active:scale-95 group relative">
          <Store size={28} strokeWidth={2.5} />
          <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm rotate-12 uppercase tracking-wider border border-green-400 z-10">FREE</span>
          
          {/* Tooltip on long press */}
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 invisible group-active:opacity-100 group-active:visible transition-all duration-300 whitespace-nowrap shadow-xl flex items-center pointer-events-none">
            List your business
            <div className="absolute -right-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm"></div>
          </span>
        </a>
      </div>

      <BottomNavigation />
    </div>
  );
}
