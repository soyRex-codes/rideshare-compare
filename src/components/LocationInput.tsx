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
}

interface MapboxFeature {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export default function LocationInput({
  label,
  placeholder,
  onSelect,
  mapboxToken,
}: LocationInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchText
          )}.json?access_token=${mapboxToken}&autocomplete=true&country=us&types=address,poi,place&limit=5`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
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
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
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
      <label className="block text-sm font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0 && !selectedAddress) setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 text-base bg-white border border-gray-200 
                   rounded-xl shadow-sm focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent
                   placeholder:text-gray-400 transition-shadow"
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                        rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((feature, index) => (
            <li
              key={index}
              onClick={() => handleSelect(feature)}
              className="px-4 py-3 text-sm text-gray-700 cursor-pointer 
                         hover:bg-blue-50 active:bg-blue-100 
                         border-b border-gray-100 last:border-b-0
                         transition-colors"
            >
              <span className="mr-2 text-gray-400">📍</span>
              {feature.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
