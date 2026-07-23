"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

interface CascadingLocationProps {
  country: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
  landmark: string;
  onChange: (updates: any) => void;
}

// Reusable Searchable Dropdown for Country, State, City
function SearchableSelect({
  label,
  value,
  options,
  loading,
  disabled,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  loading: boolean;
  disabled: boolean;
  placeholder: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block font-bold mb-2">{label} *</label>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-colors"
      >
        <span className={value ? "text-gray-900 dark:text-white truncate" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />}
          <ChevronDown size={16} className="text-gray-500 shrink-0" />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-[#242424] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-yellow-50 dark:hover:bg-[#333] ${value === opt ? 'bg-yellow-50/50 dark:bg-[#333]/50 font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {opt}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-4 text-center text-sm text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CascadingLocation({
  country,
  state,
  city,
  pincode,
  address,
  landmark,
  onChange
}: CascadingLocationProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState({ country: false, state: false, city: false });

  // 1. Fetch Countries on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, country: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const json = await res.json();
        const countryNames = json.data.map((c: any) => c.country).sort();
        setCountries(countryNames);
        
        // Default to India if no country is set
        if (!country && countryNames.includes("India")) {
          onChange({ country: "India" });
        }
      } catch (err) {
        console.error("Failed to fetch countries", err);
      } finally {
        setLoading(prev => ({ ...prev, country: false }));
      }
    };
    fetchCountries();
  }, []); // Run only once

  // 2. Fetch States when Country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!country) {
        setStates([]);
        return;
      }
      setLoading(prev => ({ ...prev, state: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country })
        });
        const json = await res.json();
        
        if (json.data && json.data.states) {
          const stateNames = json.data.states.map((s: any) => s.name).sort();
          setStates(stateNames);
        } else {
          setStates([]);
        }
      } catch (err) {
        console.error("Failed to fetch states", err);
        setStates([]);
      } finally {
        setLoading(prev => ({ ...prev, state: false }));
      }
    };
    
    if (country) fetchStates();
  }, [country]);

  // 3. Fetch Cities when State changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!country || !state) {
        setCities([]);
        return;
      }
      setLoading(prev => ({ ...prev, city: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, state })
        });
        const json = await res.json();
        
        if (json.data) {
          setCities(json.data.sort());
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
        setCities([]);
      } finally {
        setLoading(prev => ({ ...prev, city: false }));
      }
    };
    
    if (state) fetchCities();
  }, [country, state]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchableSelect
          label="Country"
          value={country || ""}
          options={countries}
          loading={loading.country}
          disabled={countries.length === 0}
          placeholder="Select Country"
          onChange={(val) => onChange({ country: val, state: "", city: "" })}
        />
        <SearchableSelect
          label="State"
          value={state || ""}
          options={states}
          loading={loading.state}
          disabled={!country || states.length === 0}
          placeholder="Select State"
          onChange={(val) => onChange({ state: val, city: "" })}
        />
        <SearchableSelect
          label="City"
          value={city || ""}
          options={cities}
          loading={loading.city}
          disabled={!state || cities.length === 0}
          placeholder="Select City"
          onChange={(val) => onChange({ city: val })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold mb-2">Pincode *</label>
          <input
            type="text"
            value={pincode || ""}
            onChange={(e) => onChange({ pincode: e.target.value })}
            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Landmark</label>
          <input
            type="text"
            value={landmark || ""}
            onChange={(e) => onChange({ landmark: e.target.value })}
            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2">Complete Address *</label>
        <textarea
          value={address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          rows={2}
          placeholder="Door No, Building, Area"
          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>
  );
}
