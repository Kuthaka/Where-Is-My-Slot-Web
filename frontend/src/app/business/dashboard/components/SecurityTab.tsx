"use client";

import { Shield, KeyRound } from "lucide-react";
import { useState } from "react";

export default function SecurityTab({ user, handlePasswordSubmit, passwordLoading, passwordMessage }: any) {
  const [passwordState, setPasswordState] = useState({ oldPassword: "", newPassword: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordSubmit(e, passwordState);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Security & Login</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your account security and password settings.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#242424] p-8 md:p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl text-yellow-500">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {user?.isPasswordSet ? "Update Password" : "Set Account Password"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {user?.isPasswordSet
                ? "Keep your account secure by using a strong password."
                : "Set a password to log in without needing an OTP every time."}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {user?.isPasswordSet && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={passwordState.oldPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, oldPassword: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {passwordMessage?.text && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${passwordMessage.type === "error" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"}`}>
              {passwordMessage.text}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-500 transition-colors shadow-md disabled:opacity-50"
            >
              {passwordLoading ? "Saving Changes..." : user?.isPasswordSet ? "Update Password" : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
