"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "../../layout";
import { Camera, Save, ArrowLeft, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { business, setBusiness } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState<{ logo: boolean; coverPhoto: boolean }>({ logo: false, coverPhoto: false });

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    websiteUrl: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    primaryCategory: "",
    logo: "",
    coverPhoto: ""
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        tagline: business.tagline || "",
        description: business.description || "",
        phone: business.phone || "",
        email: business.email || "",
        websiteUrl: business.websiteUrl || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        pincode: business.pincode || "",
        primaryCategory: business.primaryCategory || "",
        logo: business.logo || "",
        coverPhoto: business.coverPhoto || ""
      });
    }
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverPhoto') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    setImageUploading(prev => ({ ...prev, [type]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/businesses/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();

      setFormData(prev => ({
        ...prev,
        [type]: data.data.url,
      }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Cover Photo'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/businesses/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message?.message || errorData.message || "Failed to update profile");
      }
      
      const responseData = await res.json();
      const updatedBusiness = responseData.data !== undefined ? responseData.data : responseData;
      setBusiness(updatedBusiness); // Update the global dashboard context
      toast.success("Profile updated successfully!");
      router.push("/business/dashboard/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!business) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between bg-white dark:bg-[#242424] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/business/dashboard/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <form className="space-y-6">
        {/* Media Section */}
        <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Branding & Media</h2>
          
          <div className="space-y-8">
            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cover Photo</label>
              <div className="relative h-48 w-full rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group">
                {formData.coverPhoto ? (
                  <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-bold">Upload Cover</span>
                  </div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${formData.coverPhoto ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                  {imageUploading.coverPhoto ? (
                    <Loader2 className="animate-spin text-white w-8 h-8" />
                  ) : (
                    <label className="cursor-pointer bg-white dark:bg-black text-gray-900 dark:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xl">
                      <Camera size={16} /> Change Cover
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverPhoto')} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden group shrink-0">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-xs font-bold mt-1">Logo</span>
                  </div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${formData.logo ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                  {imageUploading.logo ? (
                    <Loader2 className="animate-spin text-white w-6 h-6" />
                  ) : (
                    <label className="cursor-pointer p-2 bg-white dark:bg-black rounded-full text-gray-900 dark:text-white shadow-xl">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Business Logo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recommended size: 512x512px. Used for your profile picture in feeds.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="A short, catchy phrase..." className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Category</label>
              <select name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white">
                <option value="">Select Category</option>
                <option value="Restaurant">Restaurant & Cafe</option>
                <option value="Retail">Retail & Shopping</option>
                <option value="Service">Professional Service</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health & Wellness</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white resize-none" />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white dark:bg-[#242424] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-yellow-500" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Contact & Location</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
              <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
              <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">State</label>
              <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
