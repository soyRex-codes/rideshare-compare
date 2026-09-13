"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Hardcoded driver profiles ────────────────────────────────────────────────
// Edit these to add/remove/change your drivers.
const DRIVERS = [
  {
    id: "driver-1",
    name: "G",
    photo: null, // Set to a URL string if you have a photo
    rating: 5.0,
    rides: 1200,
    vehicle: "2023 Toyota Camry · Black",
    bio: "Full-time driver, 3+ years of experience. Clean car, safe rides, always on time.",
    phone: "+1 (555) 123-4567",       // REQUIRED — update with real number
    whatsapp: "+15551234567",          // Optional — update or set to null
    email: "alex@ridesharecompare.com", // Optional — update or set to null
    imessage: "+15551234567",          // Optional — update or set to null
    availability: "Mon–Sat, 6 AM – 11 PM",
  },
  {
    id: "driver-2",
    name: "Jordan Mitchell",
    photo: null,
    rating: 4.8,
    rides: 850,
    vehicle: "2022 Honda Accord · Silver",
    bio: "Part-time driver, great with airport runs and long-distance trips. 5-star rated.",
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
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              our drivers
            </h1>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest">
              Save 30% on every ride
            </p>
          </div>
          <Link
            href="/"
            className="text-[13px] text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            ← Compare prices
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-5 max-w-md mx-auto w-full space-y-5">
        {/* Value proposition */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-[13px] text-green-800 font-medium">
            Why book with us?
          </p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-green-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
              30% cheaper than Uber & Lyft — same quality ride
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
              Vetted, experienced local drivers
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
              Schedule rides in advance — no surge pricing
            </li>
          </ul>
        </div>

        {/* ─── Driver Profiles ─── */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Meet the drivers
          </h2>

          {DRIVERS.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-xl border border-neutral-100 p-4"
            >
              {/* Driver header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-lg font-semibold shrink-0">
                  {driver.photo ? (
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    driver.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    {driver.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-neutral-500">
                      ★ {driver.rating}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-[12px] text-neutral-500">
                      {driver.rides.toLocaleString()} rides
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle & bio */}
              <p className="text-[12px] text-neutral-400 mb-1">{driver.vehicle}</p>
              <p className="text-[13px] text-neutral-600 mb-3">{driver.bio}</p>

              {/* Availability */}
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-3">
                Available: {driver.availability}
              </div>

              {/* Contact buttons */}
              <div className="flex flex-wrap gap-2">
                {/* Phone — always shown */}
                <a
                  href={`tel:${driver.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 text-white text-[12px] font-medium
                             hover:bg-neutral-800 active:scale-[0.97] transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  Call
                </a>

                {/* Text/SMS */}
                <a
                  href={`sms:${driver.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-[12px] font-medium
                             hover:bg-blue-700 active:scale-[0.97] transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  Text
                </a>

                {/* WhatsApp */}
                {driver.whatsapp && (
                  <a
                    href={`https://wa.me/${driver.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-[12px] font-medium
                               hover:bg-[#20bd5a] active:scale-[0.97] transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.124 1.52 5.862L0 24l6.335-1.652A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.97 0-3.837-.53-5.445-1.453l-.39-.232-3.76.98.998-3.648-.254-.404A9.72 9.72 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}

                {/* Email */}
                {driver.email && (
                  <a
                    href={`mailto:${driver.email}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-neutral-700 text-[12px] font-medium
                               hover:bg-neutral-200 active:scale-[0.97] transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M22 7l-10 7L2 7"/>
                    </svg>
                    Email
                  </a>
                )}

                {/* iMessage */}
                {driver.imessage && (
                  <a
                    href={`sms:${driver.imessage.replace(/\D/g, "")}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#34C759] text-white text-[12px] font-medium
                               hover:bg-[#2db84e] active:scale-[0.97] transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                    </svg>
                    iMessage
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Schedule a Ride Form ─── */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Schedule a ride
          </h2>

          {formSent ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">✓</div>
              <p className="text-[15px] font-semibold text-green-800">
                Request sent!
              </p>
              <p className="text-[13px] text-green-600 mt-1">
                One of our drivers will reach out shortly to confirm your ride.
              </p>
              <button
                onClick={() => {
                  setFormSent(false);
                  setFormData({ name: "", phone: "", pickup: "", dropoff: "", datetime: "", notes: "" });
                }}
                className="mt-3 text-[13px] text-green-700 font-medium underline"
              >
                Schedule another ride
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3"
            >
              {/* Name */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  Phone number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all"
                />
              </div>

              {/* Pickup */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  Pickup location
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickup}
                  onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                  placeholder="123 Main St, Springfield"
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all"
                />
              </div>

              {/* Drop-off */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  Drop-off location
                </label>
                <input
                  type="text"
                  required
                  value={formData.dropoff}
                  onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                  placeholder="456 Oak Ave, Springfield"
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  When
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.datetime}
                  onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                  Notes <span className="text-neutral-300">(optional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests, number of passengers, luggage, etc."
                  rows={3}
                  className="w-full px-3 py-2.5 text-[14px] bg-neutral-50 border border-neutral-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                             focus:border-blue-500 placeholder:text-neutral-300 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white text-[14px] font-semibold transition-all
                           ${
                             isSubmitting
                               ? "bg-neutral-400 cursor-not-allowed"
                               : "bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98]"
                           }`}
              >
                {isSubmitting ? "Sending request..." : "Request a ride"}
              </button>

              <p className="text-center text-[11px] text-neutral-300">
                A driver will confirm your ride via text or call
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-[11px] text-neutral-300 border-t border-neutral-100">
        Prices are 30% less than estimated Uber & Lyft fares
      </footer>
    </main>
  );
}
