import { NextResponse } from 'next/server';
import { EstimateRequest, EstimateResponse } from '@/types';
import { calculateUberEstimate, calculateLyftEstimate, getSurgeMultiplier, getWeatherMultiplier, getWeatherDescription } from '@/lib/pricing';
import { getCachedWeather, setCachedWeather } from '@/lib/weather-cache';

export async function POST(request: Request) {
  try {
    const body = await request.json() as EstimateRequest;

    if (!body.pickup || !body.dropoff) {
      return NextResponse.json({ error: 'Missing pickup or dropoff' }, { status: 400 });
    }

    const { pickup, dropoff } = body;
    if (typeof pickup.latitude !== 'number' || typeof pickup.longitude !== 'number' ||
        typeof dropoff.latitude !== 'number' || typeof dropoff.longitude !== 'number') {
      return NextResponse.json({ error: 'Invalid location coordinates' }, { status: 400 });
    }

    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 });
    }

    const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?access_token=${mapboxToken}`;
    const directionsRes = await fetch(mapboxUrl);
    
    if (!directionsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch directions from Mapbox' }, { status: 500 });
    }

    const directionsData = await directionsRes.json();
    if (!directionsData.routes || directionsData.routes.length === 0) {
      return NextResponse.json({ error: 'No route found' }, { status: 400 });
    }

    const route = directionsData.routes[0];
    const distanceMiles = route.distance * 0.000621371; // convert meters to miles
    const durationMinutes = route.duration / 60; // convert seconds to minutes

    let weatherCode = 800; // default clear
    let weatherCondition = 'Clear';
    
    const cachedWeather = getCachedWeather(pickup.latitude, pickup.longitude);
    if (cachedWeather) {
      weatherCode = cachedWeather.weatherCode;
      weatherCondition = cachedWeather.description;
    } else {
      const openweatherToken = process.env.OPENWEATHER_API_KEY;
      if (openweatherToken) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pickup.latitude}&lon=${pickup.longitude}&appid=${openweatherToken}`;
        const weatherRes = await fetch(weatherUrl);
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          if (weatherData.weather && weatherData.weather.length > 0) {
            weatherCode = weatherData.weather[0].id;
            weatherCondition = getWeatherDescription(weatherCode);
            setCachedWeather(pickup.latitude, pickup.longitude, {
              weatherCode,
              description: weatherCondition,
              temp: weatherData.main?.temp || 0
            });
          }
        }
      }
    }

    const now = new Date();
    const surgeMultiplier = getSurgeMultiplier(now);
    const weatherMultiplier = getWeatherMultiplier(weatherCode);

    const uberEst = calculateUberEstimate(distanceMiles, durationMinutes, surgeMultiplier, weatherMultiplier);
    const lyftEst = calculateLyftEstimate(distanceMiles, durationMinutes, surgeMultiplier, weatherMultiplier);

    const response: EstimateResponse = {
      uber: {
        service: 'uber',
        displayName: 'UberX',
        low: uberEst.low,
        high: uberEst.high,
        surgeMultiplier,
        weatherMultiplier
      },
      lyft: {
        service: 'lyft',
        displayName: 'Lyft Standard',
        low: lyftEst.low,
        high: lyftEst.high,
        surgeMultiplier,
        weatherMultiplier
      },
      trip: {
        distanceMiles: Number(distanceMiles.toFixed(2)),
        durationMinutes: Number(durationMinutes.toFixed(2)),
        weatherCondition
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
