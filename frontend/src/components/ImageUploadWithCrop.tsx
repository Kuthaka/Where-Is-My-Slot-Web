"use client";

import React, { useState, useCallback } from "react";
import { Upload, Camera, ImageIcon } from "lucide-react";
import Cropper from "react-easy-crop";

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

interface ImageUploadWithCropProps {
  value: string;
  onChange: (val: string) => void;
  type: "logo" | "cover";
  label?: string;
}

export default function ImageUploadWithCrop({ value, onChange, type, label }: ImageUploadWithCropProps) {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImage(reader.result as string);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      if (cropImage && croppedAreaPixels) {
        const cropped = await getCroppedImg(cropImage, croppedAreaPixels);
        onChange(cropped);
      }
      setCropModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to crop image");
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{label}</label>}
      
      {type === "cover" ? (
        <div className="relative h-64 w-full rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group flex items-center justify-center">
          {value ? (
            <img src={value} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          )}
          <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Upload className="w-10 h-10 text-gray-700 dark:text-white drop-shadow-md mb-2" />
            <span className="text-gray-900 dark:text-white font-bold drop-shadow-md text-lg bg-white/50 dark:bg-black/50 px-4 py-1 rounded-full">
              {value ? "Change Cover Photo" : "Upload Cover Photo"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group flex items-center justify-center shrink-0 shadow-sm">
            {value ? (
              <img src={value} alt="Logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
            ) : (
              <Camera className="w-10 h-10 text-gray-400" />
            )}
            <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="w-8 h-8 text-gray-700 dark:text-white drop-shadow-md" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Upload a square image for best results. <br />
            It will be cropped to a perfect circle.
          </div>
        </div>
      )}

      {cropModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image</h3>
            </div>
            
            <div className="relative w-full h-[400px] bg-black/5">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={type === "logo" ? 1 : 16 / 9}
                cropShape={type === "logo" ? "round" : "rect"}
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-[#242424] flex items-center gap-4">
              <span className="text-sm font-bold text-gray-500">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-yellow-400"
              />
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-[#1a1a1a]">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showCroppedImage}
                className="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-sm"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
