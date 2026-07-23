"use client";

import React, { useState, useEffect } from "react";
import { Copy, Clock, Check } from "lucide-react";

export type DayTimings = {
  open: string;
  close: string;
  closed: boolean;
};

export type TimingsData = Record<string, DayTimings>;

interface TimingsPickerProps {
  value: TimingsData;
  onChange: (val: TimingsData) => void;
}

const DAYS = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
];

export default function TimingsPicker({ value, onChange }: TimingsPickerProps) {
  const [copiedDay, setCopiedDay] = useState<string | null>(null);

  // Initialize if empty
  useEffect(() => {
    if (!value || Object.keys(value).length === 0) {
      const initial: TimingsData = {};
      DAYS.forEach(d => {
        initial[d.id] = { open: "09:00", close: "18:00", closed: true }; // Default to closed
      });
      onChange(initial);
    }
  }, [value, onChange]);

  const toggleDay = (dayId: string) => {
    const current = value[dayId] || { open: "09:00", close: "18:00", closed: true };
    onChange({
      ...value,
      [dayId]: { ...current, closed: !current.closed },
    });
  };

  const updateTime = (dayId: string, field: "open" | "close", time: string) => {
    onChange({
      ...value,
      [dayId]: { ...value[dayId], [field]: time },
    });
  };

  const copyToAll = (sourceDayId: string) => {
    const sourceTimings = value[sourceDayId];
    if (!sourceTimings) return;

    const newValue = { ...value };
    DAYS.forEach(d => {
      if (!newValue[d.id]?.closed && d.id !== sourceDayId) {
        newValue[d.id] = { ...newValue[d.id], open: sourceTimings.open, close: sourceTimings.close };
      }
    });
    onChange(newValue);
    setCopiedDay(sourceDayId);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  if (!value || Object.keys(value).length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Step 1: Choose Days */}
      <div>
        <label className="block font-bold mb-4 flex items-center gap-2">
          <Check size={18} className="text-yellow-500" />
          1. Select Open Days
        </label>
        <div className="flex flex-wrap gap-3">
          {DAYS.map(day => {
            const isSelected = !value[day.id]?.closed;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isSelected 
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-[#1a1a1a]" 
                    : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-[#242424]"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Set Timings */}
      {DAYS.some(d => !value[d.id]?.closed) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <label className="block font-bold mb-4 flex items-center gap-2">
            <Clock size={18} className="text-yellow-500" />
            2. Set Operational Hours
          </label>
          <div className="space-y-3">
            {DAYS.filter(d => !value[d.id]?.closed).map(day => (
              <div key={day.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="font-bold w-24 text-gray-900 dark:text-white capitalize">{day.id}</span>
                
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <label className="absolute -top-2.5 left-3 bg-gray-50 dark:bg-[#1a1a1a] px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opens</label>
                    <input 
                      type="time" 
                      value={value[day.id]?.open || ""}
                      onChange={(e) => updateTime(day.id, "open", e.target.value)}
                      className="w-full p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors" 
                    />
                  </div>
                  
                  <span className="text-gray-400 font-medium">to</span>
                  
                  <div className="flex-1 relative">
                    <label className="absolute -top-2.5 left-3 bg-gray-50 dark:bg-[#1a1a1a] px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Closes</label>
                    <input 
                      type="time" 
                      value={value[day.id]?.close || ""}
                      onChange={(e) => updateTime(day.id, "close", e.target.value)}
                      className="w-full p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors" 
                    />
                  </div>
                </div>

                <div className="sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => copyToAll(day.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#242424] transition-colors whitespace-nowrap"
                    title="Apply these hours to all other open days"
                  >
                    {copiedDay === day.id ? (
                      <span className="text-green-500 flex items-center gap-1"><Check size={16} /> Applied to all</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy size={16} /> Apply to all</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
