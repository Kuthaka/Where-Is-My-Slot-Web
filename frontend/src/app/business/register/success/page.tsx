"use client";

import { CheckCircle, Store, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function BusinessSuccessPage() {
  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Header />
      <main 
        className="relative w-full flex-1 flex"
        style={{
          backgroundImage: "url('/banners/bg-banner.png')",
          backgroundSize: "80% 100%",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center pt-[96px] pb-12 px-4 lg:px-8">
          <div className="w-full max-w-md bg-white/95 dark:bg-[#242424]/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative z-10 text-center">
            
            <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center border-4 border-white dark:border-[#242424] shadow-xl mb-8 relative">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-8 h-8 rounded-full border-2 border-white dark:border-[#242424] flex items-center justify-center">
                <Store className="w-4 h-4 text-black" />
              </div>
            </div>

            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Business Created!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 px-4">
              Congratulations! Your business profile has been successfully created and you are ready to go.
            </p>

            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 mx-4 sm:mx-0">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">What&apos;s next?</h3>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-3 mb-6">
                <li className="flex gap-2"><span className="text-green-500 font-bold">✓</span> Set up your business dashboard.</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">✓</span> You&apos;ll receive a welcome email shortly.</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">✓</span> You can start adding exclusive offers immediately!</li>
              </ul>

              <a href="/business/dashboard" className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-yellow-400/30 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 transition-colors group">
                Go to Merchant Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <Link href="/" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
