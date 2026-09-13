"use client";

import { useState } from "react";
import LocationInput from "@/components/LocationInput";
import SkeletonCard from "@/components/SkeletonCard";
import ResultCard from "@/components/ResultCard";
import { EstimateResponse } from "@/types";

interface SelectedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

type AppState = "input" | "loading" | "results" | "error";

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
          pickup: {
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          },
          dropoff: {
            latitude: dropoff.latitude,
            longitude: dropoff.longitude,
          },
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
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:py-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            🚕 Rideshare Compare
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Compare Uber & Lyft prices instantly
          </p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 sm:py-8 max-w-lg mx-auto w-full">
        {/* ─── State 1: Input Screen ─── */}
        {(appState === "input" || appState === "error") && (
          <div className="space-y-5">
            {/* Location inputs */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
              <LocationInput
                label="Pickup"
                placeholder="Where from?"
                onSelect={setPickup}
                mapboxToken={mapboxToken}
              />

              {/* Divider with dots */}
              <div className="flex items-center justify-center py-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
              </div>

              <LocationInput
                label="Drop-off"
                placeholder="Where to?"
                onSelect={setDropoff}
                mapboxToken={mapboxToken}
              />
            </div>

            {/* Error message */}
            {appState === "error" && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <span className="font-medium">Error:</span> {errorMessage}
              </div>
            )}

            {/* Compare button */}
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`w-full py-4 rounded-2xl text-base font-semibold shadow-md
                         transition-all duration-200 active:scale-[0.98]
                         ${
                           canCompare
                             ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                             : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                         }`}
            >
              Compare Prices
            </button>

            {/* Helper text */}
            {!canCompare && (
              <p className="text-center text-xs text-gray-400">
                Select both locations to compare prices
              </p>
            )}
          </div>
        )}

        {/* ─── State 2: Loading Skeleton ─── */}
        {appState === "loading" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center mb-2">
              Fetching live estimates...
            </p>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ─── State 3: Result Cards ─── */}
        {appState === "results" && results && (
          <div className="space-y-4">
            <ResultCard estimate={results.uber} trip={results.trip} />
            <ResultCard estimate={results.lyft} trip={results.trip} />

            {/* Compare again */}
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl text-sm font-medium
                         bg-white border border-gray-200 text-gray-600
                         hover:bg-gray-50 shadow-sm transition-colors
                         active:scale-[0.98]"
            >
              ← Compare another route
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-gray-400 border-t border-gray-100">
        Estimates are approximate and may vary from actual fares.
      </footer>
    </main>
  );
}
