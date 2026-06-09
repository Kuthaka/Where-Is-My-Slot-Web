"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Clock, Car, Image as ImageIcon, CheckCircle } from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Details", icon: Store },
  { id: 2, title: "Contact", icon: MapPin },
  { id: 3, title: "Timings", icon: Clock },
  { id: 4, title: "Parking", icon: Car },
  { id: 5, title: "Images", icon: ImageIcon },
];

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    timings: { monday: { open: "09:00", close: "18:00" } },
    parking: { available: true, slots: 10 },
    images: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/list-business");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        alert("Please enter your Business Name.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email.trim() || !formData.email.includes("@")) {
        alert("Please enter a valid Public Email.");
        return;
      }
      if (!formData.phone.trim()) {
        alert("Please enter your Phone Number.");
        return;
      }
      if (!formData.address.trim()) {
        alert("Please enter your Full Address.");
        return;
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Extract the array of validation errors from NestJS HttpExceptionFilter format
        let errorMessage = "Failed to onboard business";
        if (errorData.message && errorData.message.message) {
          if (Array.isArray(errorData.message.message)) {
            errorMessage = errorData.message.message.join(", ");
          } else {
            errorMessage = errorData.message.message;
          }
        } else if (errorData.message) {
          errorMessage = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
        }
        throw new Error(errorMessage);
      }

      router.push("/list-business/success");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.data.url],
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Social Offline"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your business..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Public Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-gray-900 mb-4">Monday to Friday</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Opening Time</label>
                <input type="time" defaultValue="09:00" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Closing Time</label>
                <input type="time" defaultValue="22:00" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Is Parking Available?</label>
              <div className="flex gap-4 mb-6">
                <button className="flex-1 py-3 rounded-xl border-2 border-purple-600 bg-purple-50 text-purple-700 font-bold">Yes</button>
                <button className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50">No</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Approximate Slots</label>
              <input type="number" defaultValue="20" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <label className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleImageUpload}
                disabled={loading}
              />
              <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-bold text-gray-700">{loading ? "Uploading..." : "Click to upload images"}</p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative group">
                  <img src={img} alt={`preview ${index}`} className="w-full h-full object-cover" />
                  <div 
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-white text-xs font-bold">Remove</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tell us about your business</h2>
          <p className="mt-2 text-gray-500">Step {currentStep} of {STEPS.length}: {STEPS[currentStep-1].title}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-purple-100">
            <div style={{ width: `${(currentStep / STEPS.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"></div>
          </div>
          <div className="flex justify-between w-full px-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id ? 'border-purple-600 bg-purple-600 text-white shadow-md' : 'border-gray-200 bg-white text-gray-400'}`}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${currentStep >= step.id ? 'text-purple-600' : 'text-gray-400'}`}>{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 mb-8 min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Processing..." : currentStep === STEPS.length ? (
              <>Finish Setup <CheckCircle size={20} /></>
            ) : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
