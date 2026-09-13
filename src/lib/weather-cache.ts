interface CachedWeatherData {
  weatherCode: number;
  description: string;
  temp: number;
  timestamp: number;
}

const cache: Map<string, CachedWeatherData> = new Map();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCachedWeather(lat: number, lng: number) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const data = cache.get(key);
  if (data) {
    if (Date.now() - data.timestamp < TTL_MS) {
      return {
        weatherCode: data.weatherCode,
        description: data.description,
        temp: data.temp
      };
    } else {
      cache.delete(key);
    }
  }
  return null;
}

export function setCachedWeather(lat: number, lng: number, data: { weatherCode: number; description: string; temp: number }) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  cache.set(key, {
    ...data,
    timestamp: Date.now()
  });
}
