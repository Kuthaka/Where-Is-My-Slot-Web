"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Country {
  name: string;
  code: string; // Dial code e.g. +91
  flag: string; // Flag emoji or URL
  iso: string; // IN
}

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function PhoneInput({ value, onChange, placeholder = "10-digit number", required = false }: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  // Default to India +91 as requested
  const [selectedCountry, setSelectedCountry] = useState<Country>({ name: "India", code: "+91", flag: "https://flagcdn.com/w40/in.png", iso: "IN" });
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from value prop
  useEffect(() => {
    if (value && countries.length > 0) {
      // Sort by code length descending to match longest code first (e.g. +1-something vs +1)
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const match = sortedCountries.find(c => value.startsWith(c.code));
      if (match) {
        setSelectedCountry(match);
        setPhoneNumber(value.slice(match.code.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value, countries]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/codes");
        const json = await res.json();
        
        const formatted: Country[] = json.data
          .filter((c: any) => c.dial_code)
          .map((c: any) => ({
            name: c.name,
            code: c.dial_code,
            flag: `https://flagcdn.com/w40/${c.code.toLowerCase()}.png`,
            iso: c.code
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
          
        setCountries(formatted);
      } catch (err) {
        console.error("Failed to fetch countries", err);
        setCountries([{ name: "India", code: "+91", flag: "https://flagcdn.com/w40/in.png", iso: "IN" }]);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10); // Enforce max 10 digits
    setPhoneNumber(val);
    onChange(`${selectedCountry.code}${val}`);
  };

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    setIsOpen(false);
    onChange(`${c.code}${phoneNumber}`);
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.includes(searchQuery)
  );

  return (
    <div className="relative flex w-full" ref={dropdownRef}>
      {/* Country Code Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-l-xl px-3 py-3 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors focus:outline-none shrink-0"
      >
        <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-5 h-5 object-cover rounded-full" />
        <span className="font-medium text-sm whitespace-nowrap">{selectedCountry.code}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {/* Number Input */}
      <input
        type="text"
        required={required}
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 bg-white dark:bg-[#242424] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.map((c, i) => (
              <button
                key={`${c.iso}-${i}`}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-yellow-50 dark:hover:bg-[#333] ${selectedCountry.code === c.code && selectedCountry.name === c.name ? 'bg-yellow-50/50 dark:bg-[#333]/50 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <img src={c.flag} alt={c.name} className="w-5 h-5 object-cover rounded-full shadow-sm" />
                  <span className="truncate max-w-[120px] text-left">{c.name}</span>
                </div>
                <span className="text-gray-500">{c.code}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-4 text-center text-sm text-gray-500">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
