"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";

interface LocationInputProps {
  label: string;
  placeholder: string;
  onSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  mapboxToken: string;
  icon: React.ReactNode;
  allowCurrentLocation?: boolean;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
}

export default function LocationInput({
  label,
  placeholder,
  onSelect,
  mapboxToken,
  icon,
  allowCurrentLocation = false,
}: LocationInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(
    async (searchText: string) => {
      if (searchText.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      try {
        // Bounding box for Missouri (approximate): minLng,minLat,maxLng,maxLat
        const moBbox = "-95.7747,35.9957,-89.0988,40.6136";
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchText
          )}.json?access_token=${mapboxToken}&autocomplete=true&country=us&bbox=${moBbox}&proximity=ip&types=address,poi,place&limit=5`
        );
        const data = await res.json();
        if (data.features?.length > 0) {
          setSuggestions(data.features);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    },
    [mapboxToken]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedAddress("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 500);
  };

  const handleSelect = (feature: MapboxFeature) => {
    const address = feature.place_name;
    const [longitude, latitude] = feature.center;
    setQuery(address);
    setSelectedAddress(address);
    setSuggestions([]);
    setIsOpen(false);
    onSelect({ latitude, longitude, address });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&types=address,poi`
          );
          const data = await res.json();
          const address = data.features?.[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setQuery(address);
          setSelectedAddress(address);
          onSelect({ latitude, longitude, address });
        } catch (e) {
          alert("Failed to reverse geocode your location.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 && !selectedAddress) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 py-3 text-[15px] bg-neutral-50 border border-neutral-200 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                     focus:border-blue-500 placeholder:text-neutral-300 transition-all ${
                       allowCurrentLocation ? "pr-10" : "pr-4"
                     }`}
          autoComplete="off"
        />
        {allowCurrentLocation && (
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-blue-600 transition-colors"
            title="Use current location"
          >
            {isLocating ? (
              <svg className="animate-spin w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-200 
                       rounded-lg shadow-lg shadow-black/5 overflow-hidden">
          {suggestions.map((feature, index) => (
            <li
              key={index}
              onClick={() => handleSelect(feature)}
              className="px-3 py-2.5 text-[13px] text-neutral-600 cursor-pointer 
                         hover:bg-neutral-50 active:bg-neutral-100
                         border-b border-neutral-100 last:border-b-0 transition-colors"
            >
              {feature.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
