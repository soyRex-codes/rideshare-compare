"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Hardcoded driver profiles ────────────────────────────────────────────────
const DRIVERS = [
  {
    id: "driver-1",
    name: "Alex Rivera",
    // Professional Unsplash portrait
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop", 
    rating: 4.98,
    rides: 1240,
    vehicle: "2023 Toyota Camry (Black)",
    bio: "Full-time professional driver. Known for immaculate car cleanliness and safe, smooth airport transfers.",
    phone: "+1 (555) 123-4567",
    whatsapp: "+15551234567",
    email: "alex@ridoapp.com",
    imessage: "+15551234567",
    availability: "Mon–Sat, 6 AM – 11 PM",
  },
  {
    id: "driver-2",
    name: "Jordan Mitchell",
    // Professional Unsplash portrait
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    rating: 4.95,
    rides: 852,
    vehicle: "2022 Honda Accord (Silver)",
    bio: "Friendly, punctual, and highly rated for long-distance trips. Over 5 years of commercial driving experience.",
    phone: "+1 (555) 987-6543",
    whatsapp: "+15559876543",
    email: null,
    imessage: null,
    availability: "Fri–Sun, 8 AM – 12 AM",
  },
];

export default function DriversPage() {
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    datetime: "",
    notes: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/copilotagent2025@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "New Ride Request (Rido)",
          Name: formData.name,
          Phone: formData.phone,
          Pickup: formData.pickup,
          Dropoff: formData.dropoff,
          Time: formData.datetime,
          Notes: formData.notes || "None provided",
        }),
      });

      if (response.ok) {
        setFormSent(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send request. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-neutral-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-tight">
              Rido Network
            </h1>
          </div>
          <Link
            href="/"
            className="text-[13px] text-neutral-500 font-medium hover:text-neutral-900 transition-colors"
          >
            ← Back to search
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-8">
        
        {/* Value proposition / Trust section */}
        <div className="text-center space-y-2 mb-2">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight leading-snug">
            Premium rides, local drivers.
          </h2>
          <p className="text-[14px] text-neutral-500">
            Skip the algorithms. Book directly with vetted professionals and save up to 30%.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center shadow-sm shadow-black/[0.02]">
            <div className="w-8 h-8 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <p className="text-[11px] font-semibold text-neutral-900 leading-tight">Vetted<br/>Drivers</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center shadow-sm shadow-black/[0.02]">
            <div className="w-8 h-8 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="text-[11px] font-semibold text-neutral-900 leading-tight">Locked-in<br/>Pricing</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center shadow-sm shadow-black/[0.02]">
            <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p className="text-[11px] font-semibold text-neutral-900 leading-tight">5-Star<br/>Service</p>
          </div>
        </div>

        {/* ─── Driver Profiles ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h2 className="text-[14px] font-bold text-neutral-900 tracking-tight">
              Available Drivers
            </h2>
          </div>

          {DRIVERS.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-lg shadow-black/[0.03]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 shadow-inner">
                  {driver.photo ? (
                    <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">{driver.name.charAt(0)}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-bold text-neutral-900 truncate">
                      {driver.name}
                    </h3>
                    <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[13px] font-semibold text-neutral-700">
                      <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      {driver.rating}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-[12px] text-neutral-500 font-medium">
                      {driver.rides.toLocaleString()} trips
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-[13px] text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M3 11l2.5-6h13L21 11"/></svg>
                  <span>{driver.vehicle}</span>
                </div>
                <div className="flex items-start gap-2 text-[13px] text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{driver.availability}</span>
                </div>
              </div>
              
              <p className="text-[13px] text-neutral-500 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100 mb-4 italic">
                "{driver.bio}"
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={scrollToForm}
                  className="flex-1 bg-neutral-900 text-white py-2.5 rounded-lg text-[13px] font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Book {driver.name.split(" ")[0]}
                </button>
                <div className="flex gap-2">
                  <a href={`tel:${driver.phone.replace(/\D/g, "")}`} className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  </a>
                  <a href={`sms:${driver.phone.replace(/\D/g, "")}`} className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Schedule a Ride Form ─── */}
        <div ref={formRef} className="pt-4 pb-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.04] border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-900 px-5 py-4">
              <h2 className="text-[16px] font-bold text-white tracking-tight">
                Submit a Ride Request
              </h2>
              <p className="text-[12px] text-neutral-400 mt-1">
                Drivers will respond quickly to confirm your trip.
              </p>
            </div>
            
            <div className="p-5">
              {formSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-[18px] font-bold text-neutral-900 mb-1">
                    Request Received!
                  </p>
                  <p className="text-[14px] text-neutral-500 mb-6">
                    A driver will text or call you shortly to confirm details.
                  </p>
                  <button
                    onClick={() => {
                      setFormSent(false);
                      setFormData({ name: "", phone: "", pickup: "", dropoff: "", datetime: "", notes: "" });
                    }}
                    className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pickup}
                      onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                      placeholder="e.g. 123 Main St"
                      className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Drop-off Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dropoff}
                      onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                      placeholder="e.g. The Arch"
                      className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.datetime}
                      onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                      className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Flight / Notes <span className="font-normal normal-case text-neutral-400">(optional)</span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Luggage details, flight numbers, etc."
                      rows={2}
                      className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-2 py-3.5 rounded-xl text-white text-[15px] font-bold transition-all shadow-lg
                              ${
                                isSubmitting
                                  ? "bg-neutral-400 cursor-not-allowed shadow-none"
                                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-600/20"
                              }`}
                  >
                    {isSubmitting ? "Sending request..." : "Submit Ride Request"}
                  </button>
                  <p className="text-center text-[11px] text-neutral-400 mt-3 font-medium">
                    Secure and private. Information sent directly to dispatch.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
