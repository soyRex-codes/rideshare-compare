interface CachedRoute {
  distance: number;
  duration: number;
  timestamp: number;
}

const routeCache = new Map<string, CachedRoute>();
const ROUTE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function getCachedRoute(pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number): { distance: number, duration: number } | null {
  // Round to 3 decimal places (approx 100 meters precision) to maximize cache hits for very close clicks
  const key = `${pickupLat.toFixed(3)},${pickupLng.toFixed(3)}-${dropoffLat.toFixed(3)},${dropoffLng.toFixed(3)}`;
  const entry = routeCache.get(key);
  
  if (entry) {
    if (Date.now() - entry.timestamp > ROUTE_CACHE_TTL) {
      routeCache.delete(key);
      return null;
    }
    return { distance: entry.distance, duration: entry.duration };
  }
  return null;
}

export function setCachedRoute(pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number, distance: number, duration: number) {
  const key = `${pickupLat.toFixed(3)},${pickupLng.toFixed(3)}-${dropoffLat.toFixed(3)},${dropoffLng.toFixed(3)}`;
  routeCache.set(key, { distance, duration, timestamp: Date.now() });
}
