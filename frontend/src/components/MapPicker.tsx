"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

export default function MapPicker({ position, setPosition, readonly = false }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;

  const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default India

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 z-0 relative">
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 15 : 4}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} readonly={readonly} />
      </MapContainer>
    </div>
  );
}
