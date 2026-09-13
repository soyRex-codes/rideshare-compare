"use client";

import { useState } from "react";
import LocationInput from "@/components/LocationInput";
import SkeletonCard from "@/components/SkeletonCard";
import ResultCard from "@/components/ResultCard";
import RouteMap from "@/components/RouteMap";
import { EstimateResponse } from "@/types";

interface SelectedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

type AppState = "input" | "loading" | "results" | "error";

function shortenAddress(address: string): string {
  // Take just the first two parts (e.g. "123 Main St, Springfield")
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

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              rideshare compare
            </h1>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest">
              Uber vs Lyft
            </p>
          </div>
          {appState === "results" && (
            <button
              onClick={handleReset}
              className="text-[13px] text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              New search
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 px-4 py-5 max-w-md mx-auto w-full">
        {/* ─── Input Screen ─── */}
        {(appState === "input" || appState === "error") && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
              <LocationInput
                label="Pickup"
                placeholder="Enter pickup address"
                onSelect={setPickup}
                mapboxToken={mapboxToken}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="8" cy="8" r="6" strokeDasharray="2 2" />
                  </svg>
                }
              />

              {/* Connector line */}
              <div className="flex justify-start pl-[18px]">
                <div className="w-px h-4 bg-neutral-200" />
              </div>

              <LocationInput
                label="Drop-off"
                placeholder="Enter destination"
                onSelect={setDropoff}
                mapboxToken={mapboxToken}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                      fill="currentColor"
                    />
                  </svg>
                }
              />
            </div>

            {/* Selected locations preview */}
            {(pickup || dropoff) && (
              <div className="flex items-center gap-3 px-1 text-[12px] text-neutral-400">
                {pickup && (
                  <div className="flex items-center gap-1 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">{shortenAddress(pickup.address)}</span>
                  </div>
                )}
                {pickup && dropoff && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-neutral-300">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {dropoff && (
                  <div className="flex items-center gap-1 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="truncate">{shortenAddress(dropoff.address)}</span>
                  </div>
                )}
              </div>
            )}

            {appState === "error" && errorMessage && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-[13px] text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 
                         active:scale-[0.98] ${
                           canCompare
                             ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                             : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                         }`}
            >
              Compare prices
            </button>
          </div>
        )}

        {/* ─── Loading ─── */}
        {appState === "loading" && (
          <div className="space-y-3">
            <div className="h-[160px] sm:h-[200px] rounded-xl skeleton-shimmer" />
            <div className="h-10 rounded-lg skeleton-shimmer" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ─── Results ─── */}
        {appState === "results" && results && pickup && dropoff && (
          <div className="space-y-3">
            {/* Route map */}
            <RouteMap
              pickupLng={pickup.longitude}
              pickupLat={pickup.latitude}
              dropoffLng={dropoff.longitude}
              dropoffLat={dropoff.latitude}
              mapboxToken={mapboxToken}
            />

            {/* Route summary bar */}
            <div className="bg-white rounded-xl border border-neutral-100 px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Addresses */}
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-3">
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-px h-3 bg-neutral-200" />
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-neutral-700 truncate font-medium">
                      {shortenAddress(pickup.address)}
                    </p>
                    <p className="text-[13px] text-neutral-500 truncate">
                      {shortenAddress(dropoff.address)}
                    </p>
                  </div>
                </div>

                {/* Distance & Time */}
                <div className="text-right shrink-0">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    {results.trip.distanceMiles.toFixed(1)} mi
                  </p>
                  <p className="text-[12px] text-neutral-400">
                    ~{Math.round(results.trip.durationMinutes)} min
                  </p>
                </div>
              </div>

              {/* Weather badge */}
              {results.trip.weatherCondition.toLowerCase() !== "clear" && (
                <div className="mt-2 pt-2 border-t border-neutral-100">
                  <span className="text-[11px] text-neutral-400 bg-neutral-50 px-2 py-1 rounded-full">
                    {results.trip.weatherCondition} — prices adjusted
                  </span>
                </div>
              )}
            </div>

            {/* Price cards */}
            <ResultCard estimate={results.uber} />
            <ResultCard estimate={results.lyft} />

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-neutral-300 pt-1">
              Estimates may vary from actual fares
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
