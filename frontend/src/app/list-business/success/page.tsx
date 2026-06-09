"use client";

import { CheckCircle, Store, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BusinessSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-8 relative">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
            <Store className="w-4 h-4 text-yellow-900" />
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          Business Created!
        </h2>
        <p className="text-lg text-gray-600 mb-10 px-4">
          Congratulations! Your business profile has been successfully submitted and is now pending verification.
        </p>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 mx-4 sm:mx-0">
          <h3 className="font-bold text-gray-900 mb-2">What's next?</h3>
          <ul className="text-left text-sm text-gray-600 space-y-3 mb-6">
            <li className="flex gap-2"><span className="text-green-500">✓</span> Our team will review your details.</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> You'll receive a confirmation email shortly.</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> You can start adding exclusive offers!</li>
          </ul>

          <Link href="/login" className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors group">
            Login to Merchant Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
