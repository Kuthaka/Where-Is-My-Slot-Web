import Header from "@/components/Header";
import FlashDeals from "@/components/FlashDeals";
import Post from "@/components/Post";
import MerchantHub from "@/components/MerchantHub";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-xl mx-auto bg-gray-50 min-h-screen relative pb-32 shadow-xl shadow-black/5 overflow-hidden">
        <Header />
        <FlashDeals />
        
        <div className="flex flex-col bg-gray-100 gap-2 mt-2">
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

        <MerchantHub />
        <BottomNavigation />
      </main>
    </div>
  );
}
