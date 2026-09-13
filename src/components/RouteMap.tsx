interface RouteMapProps {
  pickupLng: number;
  pickupLat: number;
  dropoffLng: number;
  dropoffLat: number;
  mapboxToken: string;
}

export default function RouteMap({
  pickupLng,
  pickupLat,
  dropoffLng,
  dropoffLat,
  mapboxToken,
}: RouteMapProps) {
  // Calculate bounds with padding
  const minLng = Math.min(pickupLng, dropoffLng);
  const maxLng = Math.max(pickupLng, dropoffLng);
  const minLat = Math.min(pickupLat, dropoffLat);
  const maxLat = Math.max(pickupLat, dropoffLat);

  const padLng = (maxLng - minLng) * 0.3 || 0.01;
  const padLat = (maxLat - minLat) * 0.3 || 0.01;

  const bbox = [
    minLng - padLng,
    minLat - padLat,
    maxLng + padLng,
    maxLat + padLat,
  ];

  // Static map with path and markers
  const pathOverlay = `pin-s-a+2563eb(${pickupLng},${pickupLat}),pin-s-b+e11d48(${dropoffLng},${dropoffLat})`;
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${pathOverlay}/[${bbox.join(
    ","
  )}]/400x200@2x?access_token=${mapboxToken}&padding=30`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-neutral-200">
      <img
        src={mapUrl}
        alt="Route map"
        className="w-full h-[160px] sm:h-[200px] object-cover"
        loading="eager"
      />
    </div>
  );
}
