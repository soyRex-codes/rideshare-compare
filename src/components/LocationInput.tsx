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
}: LocationInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
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
          className="w-full pl-10 pr-4 py-3 text-[15px] bg-neutral-50 border border-neutral-200 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                     focus:border-blue-500 placeholder:text-neutral-300 transition-all"
          autoComplete="off"
        />
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
