"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Building2, UploadCloud, ChevronRight, ChevronLeft, Check, Car, Clock } from "lucide-react";
import { useModal } from "@/components/ModalProvider";

export default function BusinessOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    primaryCategory: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    timings: { monday: { open: "09:00", close: "18:00" }, tuesday: { open: "09:00", close: "18:00" } },
    parking: { available: false, slots: 0, valet: false },
    images: [] as string[],
    amenities: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        showModal({ title: "Incomplete Details", message: "Please fill in all required fields (Name, Email, Phone).", type: "alert" });
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.state) {
        showModal({ title: "Incomplete Details", message: "Please fill in location details.", type: "alert" });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/businesses/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          mobileNumbers: [formData.phone],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message?.message || errorData.message || "Failed to onboard");
      }

      router.push("/business/register/success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showModal({ title: "Error", message: `Error: ${error.message}`, type: "error" });
      } else {
        showModal({ title: "Error", message: "An error occurred", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/businesses/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.data.url],
      }));
    } catch (error) {
      showModal({ title: "Upload Failed", message: "Failed to upload image. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Basics", icon: Building2 },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Details & Parking", icon: Car },
    { id: 4, title: "Media", icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Sidebar Steps */}
        <div className="w-full md:w-1/3 bg-[#2C5EAD] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-black mb-2">Partner with us</h2>
              <p className="text-[#C4E2F5] text-sm">Create your business profile in 4 simple steps.</p>
            </div>

            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;

                return (
                  <div key={step.id} className={`flex items-center gap-4 ${isActive ? "opacity-100" : isPassed ? "opacity-70" : "opacity-40"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? "bg-white text-[#2C5EAD] shadow-lg shadow-white/20" : isPassed ? "bg-[#1591DC] text-white" : "bg-white/10 text-white"
                    }`}>
                      {isPassed ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#C4E2F5]">Step {step.id}</p>
                      <p className="font-bold">{step.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block mt-12 bg-white/10 p-6 rounded-2xl">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-sm text-[#C4E2F5]">Contact our merchant support team at support@localplatform.com</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 sm:p-12">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Tell us about your business</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Business Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="e.g. The Grand Cafe" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Business Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="contact@business.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Primary Phone *</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Primary Category</label>
                  <select name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900">
                    <option value="">Select a category</option>
                    <option value="Restaurant">Restaurant & Cafe</option>
                    <option value="Retail">Retail & Shopping</option>
                    <option value="Service">Professional Service</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="What makes your business special?"></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Where are you located?</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="Building, Street, Landmark"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State *</label>
                    <input required name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="Maharashtra" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1591DC] transition-all text-gray-900" placeholder="400001" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Details & Parking Configuration</h3>
              <div className="space-y-8">

                {/* Parking Section */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Car size={20} /></div>
                    <h4 className="font-bold text-gray-900 text-lg">Smart Parking Discovery</h4>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.parking.available}
                        onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, available: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="font-bold text-gray-700">We provide parking for customers</span>
                    </label>

                    {formData.parking.available && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Available Slots</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.parking.slots}
                            onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, slots: parseInt(e.target.value) || 0 } })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-end pb-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.parking.valet}
                              onChange={(e) => setFormData({ ...formData, parking: { ...formData.parking, valet: e.target.checked } })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm font-bold text-gray-700">Valet Parking Available</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock size={18} className="text-gray-400" /> Operating Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {["WiFi", "Air Conditioning", "Wheelchair Accessible", "Card Payment", "Pet Friendly"].map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              amenities: isSelected
                                ? prev.amenities.filter((a) => a !== amenity)
                                : [...prev.amenities, amenity],
                            }));
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isSelected ? "bg-[#2C5EAD] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {isSelected ? `✓ ${amenity}` : amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Upload Media</h3>
              <p className="text-gray-500 mb-6">Upload photos of your storefront, menu, products, or interior to attract more customers.</p>

              <div className="border-2 border-dashed border-[#C4E2F5] bg-[#F5FAFF] rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <UploadCloud size={32} className="text-[#1591DC]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Click to upload images</h4>
                <p className="text-xs text-gray-500 mb-6">SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                <label
                  htmlFor="imageUpload"
                  className="bg-[#2C5EAD] hover:bg-[#1a3d74] text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Browse Files"}
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-bold text-gray-900 mb-4">Uploaded Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-video">
                        <img src={img} alt="Business upload" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${currentStep === 1 ? "opacity-0 cursor-default" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
            >
              <ChevronLeft size={18} /> Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#1591DC] hover:bg-[#0c7abf] shadow-lg shadow-[#1591DC]/30 transition-all"
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit for Approval"} <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
