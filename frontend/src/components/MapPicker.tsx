"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  position: { lat: number; lng: number } | null;
  setPosition?: (pos: { lat: number; lng: number }) => void;
  readonly?: boolean;
}

function LocationMarker({ position, setPosition, readonly }: MapPickerProps) {
  useMapEvents({
    click(e) {
      if (!readonly && setPosition) {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapMover({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom() < 13 ? 15 : map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPicker({ position, setPosition, readonly = false }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default India
  const [mapCenter, setMapCenter] = useState(position || defaultCenter);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim() || readonly) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    // Debounce: wait 400ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&accept-language=en`
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error("Geocoding failed", err);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleSelectLocation = (result: any) => {
    const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setMapCenter(newPos);
    setSearchQuery(result.display_name);
    setShowSuggestions(false);
    if (setPosition) {
      setPosition(newPos);
    }
  };

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 z-0 relative flex flex-col">
      {!readonly && (
        <div className="absolute top-3 left-3 right-3 z-[400]" ref={searchRef}>
          <div className="relative shadow-md rounded-lg overflow-visible flex flex-col bg-white dark:bg-[#242424]">
            <div className="flex">
              <input
                type="text"
                placeholder="Search location (e.g. MG Road, Kerala)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-3 bg-transparent text-sm focus:outline-none dark:text-white"
              />
              <div className="px-4 text-gray-400 flex items-center justify-center">
                {searching ? (
                  <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search size={18} />
                )}
              </div>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectLocation(s)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-yellow-50 dark:hover:bg-[#333] border-b last:border-b-0 border-gray-50 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {s.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={position ? 15 : 4}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMover center={mapCenter} />
        <LocationMarker position={position} setPosition={setPosition} readonly={readonly} />
      </MapContainer>
    </div>
  );
}
