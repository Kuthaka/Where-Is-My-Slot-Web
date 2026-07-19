"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Car, Store, Navigation, MapPin } from "lucide-react";

// Fix default icon issue with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ChangeView({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
  const map = useMap();
  map.setView([center.lat, center.lng], zoom);
  return null;
}

interface ParkingMapViewProps {
  parkings: any[];
  currentLocation: { latitude: number; longitude: number } | null;
}

export default function ParkingMapView({ parkings, currentLocation }: ParkingMapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[600px] w-full bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />;

  const center = currentLocation 
    ? { lat: currentLocation.latitude, lng: currentLocation.longitude } 
    : { lat: 20.5937, lng: 78.9629 };

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 z-0 relative shadow-sm">
      <MapContainer
        center={center}
        zoom={currentLocation ? 13 : 4}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <ChangeView center={center} zoom={currentLocation ? 13 : 4} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Current user location marker (different color) */}
        {currentLocation && (
          <Marker 
            position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

        {/* Parking markers */}
        {parkings.map(spot => {
          if (!spot.location?.coordinates) return null;
          const [lng, lat] = spot.location.coordinates;
          const totalCarSlots = spot.slots?.car?.total || 0;
          const occupiedCars = spot.slots?.car?.occupied || 0;
          const available = Math.max(0, totalCarSlots - occupiedCars);
          const isBusiness = spot.source === 'BUSINESS';

          return (
            <Marker key={spot._id} position={{ lat, lng }}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-black text-lg text-gray-900 mb-1">{spot.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin size={10} className="text-yellow-500" /> {spot.address || spot.city}
                  </p>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl mb-3">
                    <div className="text-center">
                      <span className="block text-xl font-black text-green-500">{available}</span>
                      <span className="text-[9px] font-bold uppercase text-gray-500">Available</span>
                    </div>
                    <div className="text-center border-l border-gray-200 pl-3">
                      <span className="block text-xl font-black text-gray-700">{totalCarSlots}</span>
                      <span className="text-[9px] font-bold uppercase text-gray-500">Total</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank')}
                      className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-lg font-bold text-black flex justify-center items-center gap-1 text-xs"
                    >
                      <Navigation size={12} /> Navigate
                    </button>
                    {isBusiness && spot.businessId && (
                      <Link 
                        href={`/b/${spot.businessId._id || spot.businessId}`} 
                        className="py-2 px-3 bg-gray-900 hover:bg-black transition-colors rounded-lg font-bold text-white flex items-center justify-center"
                      >
                        <Store size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
