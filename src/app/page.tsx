"use client";

import { useState } from "react";
import Link from "next/link";
import LocationInput from "@/components/LocationInput";
import ComparisonCard from "@/components/ComparisonCard";
import SkeletonCard from "@/components/SkeletonCard";
import RouteMap from "@/components/RouteMap";
import { EstimateResponse } from "@/types";

interface SelectedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

type AppState = "input" | "loading" | "results" | "error";

function shortenAddress(address: string): string {
  const parts = address.split(",").map((s) => s.trim());
  return parts.length > 2 ? parts.slice(0, 2).join(", ") : address;
}

export default function Home() {
  const [pickup, setPickup] = useState<SelectedLocation | null>(null);
  const [dropoff, setDropoff] = useState<SelectedLocation | null>(null);
  const [appState, setAppState] = useState<AppState>("input");
  const [results, setResults] = useState<EstimateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const canCompare = pickup !== null && dropoff !== null;

  const handleCompare = async () => {
    if (!pickup || !dropoff) return;
    setAppState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: { latitude: pickup.latitude, longitude: pickup.longitude },
          dropoff: { latitude: dropoff.latitude, longitude: dropoff.longitude },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get estimates");
      }

      const data: EstimateResponse = await res.json();
      setResults(data);
      setAppState("results");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("input");
    setResults(null);
    setPickup(null);
    setDropoff(null);
    setErrorMessage("");
  };

  // Generic cool map background for the initial state
  const defaultMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-122.4194,37.7749,12,0/800x600@2x?access_token=${mapboxToken}`;

  return (
    <main className="min-h-screen flex flex-col relative bg-neutral-50">
      {/* Background Map for Input State */}
      {(appState === "input" || appState === "error") && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-50/80 to-neutral-50 z-10" />
          <img 
            src={defaultMapUrl} 
            alt="Map background" 
            className="w-full h-[50vh] object-cover opacity-60 mix-blend-multiply"
          />
        </div>
      )}

      {/* Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 px-4 py-4 sticky top-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-tight">
                Rido
              </h1>
            </div>
          </div>
          {appState === "results" ? (
            <button
              onClick={handleReset}
              className="text-[13px] bg-neutral-100 px-3 py-1.5 rounded-full text-neutral-700 font-medium hover:bg-neutral-200 transition-colors"
            >
              New search
            </button>
          ) : (
            <Link
              href="/drivers"
              className="text-[13px] text-neutral-500 font-medium hover:text-neutral-900 transition-colors"
            >
              Meet our drivers
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-20 flex-1 px-4 py-6 max-w-md mx-auto w-full flex flex-col">
        {/* ─── Input Screen ─── */}
        {(appState === "input" || appState === "error") && (
          <div className="space-y-6 mt-auto mb-auto">
            
            {/* Hero Text */}
            <div className="text-center space-y-2 mb-6 px-2">
              <h2 className="text-2xl sm:text-[26px] font-bold text-neutral-900 tracking-tight leading-snug">
                Rido is better and always more affordable.
              </h2>
              <p className="text-sm text-neutral-500">
                Compare live prices and save 30% against Uber & Lyft.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.03] border border-neutral-100 p-4 space-y-3">
              <LocationInput
                label="Pickup"
                placeholder="Current location or address"
                onSelect={setPickup}
                mapboxToken={mapboxToken}
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="8" cy="8" r="6" strokeDasharray="2 2" />
                  </svg>
                }
              />

              {/* Connector line */}
              <div className="flex justify-start pl-[18px]">
                <div className="w-[1.5px] h-5 bg-neutral-200 rounded-full" />
              </div>

              <LocationInput
                label="Drop-off"
                placeholder="Where are you going?"
                onSelect={setDropoff}
                mapboxToken={mapboxToken}
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor" />
                  </svg>
                }
              />
            </div>

            {/* Selected locations preview */}
            {(pickup || dropoff) && (
              <div className="flex items-center gap-3 px-2 text-[13px] text-neutral-500 font-medium">
                {pickup && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-neutral-900 shrink-0" />
                    <span className="truncate">{shortenAddress(pickup.address)}</span>
                  </div>
                )}
                {pickup && dropoff && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-neutral-300">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {dropoff && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span className="truncate">{shortenAddress(dropoff.address)}</span>
                  </div>
                )}
              </div>
            )}

            {appState === "error" && errorMessage && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[13px] text-red-600 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {errorMessage}
              </div>
            )}

            {/* Address tip banner */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-blue-700 text-[12px] leading-relaxed">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <p>
                <strong>Tip:</strong> If you can't find your exact location, copy and paste the address directly from Google Maps or Apple Maps for best results.
              </p>
            </div>

            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`w-full py-4 rounded-xl text-[16px] font-bold tracking-wide transition-all duration-200 
                         active:scale-[0.98] shadow-lg ${
                           canCompare
                             ? "bg-neutral-900 hover:bg-neutral-800 text-white shadow-neutral-900/20"
                             : "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                         }`}
            >
              Compare prices
            </button>
            
            {/* Trust Badges */}
            <div className="flex justify-center gap-6 pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-sm font-bold">U</div>
                <span className="text-[10px] text-neutral-400 font-medium">Uber</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-sm font-bold">L</div>
                <span className="text-[10px] text-neutral-400 font-medium">Lyft</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-sm font-bold text-green-500">%</div>
                <span className="text-[10px] text-neutral-400 font-medium">Local</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Loading ─── */}
        {appState === "loading" && (
          <div className="space-y-4">
            <div className="h-[180px] sm:h-[220px] rounded-2xl skeleton-shimmer border border-neutral-100 shadow-sm" />
            <div className="h-14 rounded-xl skeleton-shimmer border border-neutral-100 shadow-sm" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ─── Results ─── */}
        {appState === "results" && results && pickup && dropoff && (
          <div className="space-y-4">
            {/* Route map */}
            <div className="shadow-sm rounded-2xl overflow-hidden border border-neutral-100">
              <RouteMap
                pickupLng={pickup.longitude}
                pickupLat={pickup.latitude}
                dropoffLng={dropoff.longitude}
                dropoffLat={dropoff.latitude}
                mapboxToken={mapboxToken}
              />
            </div>

            {/* Route summary bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-center justify-between">
                {/* Addresses */}
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                  <div className="flex flex-col items-center gap-1.5 shrink-0 py-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                    <div className="w-[1.5px] h-4 bg-neutral-200 rounded-full" />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-[14px] text-neutral-900 truncate font-semibold leading-none">
                      {shortenAddress(pickup.address)}
                    </p>
                    <p className="text-[14px] text-neutral-500 truncate font-medium leading-none">
                      {shortenAddress(dropoff.address)}
                    </p>
                  </div>
                </div>

                {/* Distance & Time */}
                <div className="text-right shrink-0 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100">
                  <p className="text-[16px] font-bold text-neutral-900">
                    {results.trip.distanceMiles.toFixed(1)} mi
                  </p>
                  <p className="text-[12px] font-medium text-neutral-500">
                    ~{Math.round(results.trip.durationMinutes)} min
                  </p>
                </div>
              </div>

              {/* Weather badge */}
              {results.trip.weatherCondition.toLowerCase() !== "clear" && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg inline-flex">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1384 20.187 10.2003 17.8785 10.021C17.3758 7.17066 14.9213 5 12 5C8.68629 5 6 7.68629 6 11C6 11.0963 6.00227 11.192 6.00673 11.2869C3.76008 11.5833 2 13.5284 2 15.9375C2 18.733 4.26703 21 7.0625 21H16" /></svg>
                    {results.trip.weatherCondition} — prices adjusted
                  </div>
                </div>
              )}
            </div>

            {/* Price comparison */}
            <div className="pt-2">
              <ComparisonCard 
                uber={results.uber} 
                lyft={results.lyft} 
                pickupAddress={pickup.address} 
                dropoffAddress={dropoff.address} 
              />
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[12px] font-medium text-neutral-400 pt-2 pb-6">
              Estimates may vary from actual fares
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
