"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Upload, Camera, ImageIcon, ArrowLeft } from "lucide-react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDashboard } from "../../layout";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
}

export default function EditProfilePage() {
  const router = useRouter();
  const { business, setBusiness } = useDashboard();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const [loading, setLoading] = useState(false);

  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [cropType, setCropType] = useState<"logo" | "cover">("logo");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Initialize state once business is loaded
  useEffect(() => {
    if (business) {
      setName(business.name || "");
      setDescription(business.description || "");
      setPhone(business.phone || "");
      setLogo(business.logo || "");
      setCoverPhoto(business.coverPhoto || "");
      setAddress(business.address || "");
      setCity(business.city || "");
      if (business.latitude && business.longitude) {
        setLocation({ lat: business.latitude, lng: business.longitude });
      }
    }
  }, [business]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImage(reader.result as string);
        setCropType(type);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
      if (cropType === "logo") setLogo(croppedImage);
      else setCoverPhoto(croppedImage);
      setCropModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/v1/businesses/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name, 
          description, 
          phone, 
          logo, 
          coverPhoto,
          address,
          city,
          latitude: location?.lat,
          longitude: location?.lng
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setBusiness(data.data || data);
        router.push("/business/dashboard");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!business) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white dark:bg-[#242424] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Edit Profile</h1>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Banner Edit */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Cover Photo (Banner)</label>
            <div className="relative h-64 w-full rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group flex items-center justify-center">
              {coverPhoto ? (
                <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
              <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="w-10 h-10 text-white drop-shadow-md mb-2" />
                <span className="text-white font-bold drop-shadow-md text-lg">Change Cover Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cover")} />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-bold">16:9 widescreen format works best.</p>
          </div>

          {/* Logo Edit */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Business Logo</label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group flex items-center justify-center shrink-0 shadow-sm">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
                <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-8 h-8 text-white drop-shadow-md" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "logo")} />
                </label>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Upload a square image for best results. <br />
                It will be cropped to a perfect circle for avatars and lists.
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all text-gray-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all text-gray-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description / Tagline</label>
              <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all text-gray-900 dark:text-white resize-none" />
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-yellow-500" /> Location Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Main St, Floor 2" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. New York" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pin on Map (Required for Discovery)</label>
              <div className="relative z-0">
                <MapPicker position={location} setPosition={setLocation} />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-bold">Click on the map to set your exact business location.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1a1a] px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button onClick={() => router.back()} disabled={loading} className="px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#242424] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]">
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Cropper Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
          <div className="absolute top-6 right-6 z-[110] flex gap-3">
            <button onClick={() => setCropModalOpen(false)} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors">Cancel</button>
            <button onClick={showCroppedImage} className="px-6 py-2.5 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-colors">Crop & Save</button>
          </div>
          
          <div className="relative w-full h-[70vh] md:w-3/4 max-w-4xl bg-gray-900 rounded-[32px] overflow-hidden mt-10 shadow-2xl">
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={cropType === "logo" ? 1 : 16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
}
