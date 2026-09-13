# 🚕 Rideshare Compare

Compare Uber and Lyft price estimates instantly. Enter pickup and drop-off locations and get real-time fare comparisons based on route distance, traffic duration, time-of-day surge, and weather conditions.

## Features

- **Mapbox Autocomplete** — smooth address search for pickup & drop-off
- **Real-time Pricing** — estimates based on distance, duration, surge, and weather
- **Mobile-First UI** — designed for phone screens, works everywhere
- **Weather-Aware** — adjusts prices for rain, snow, and storms

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Mapbox Geocoding & Directions API**
- **OpenWeather API**

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and add your API keys
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MAPBOX_ACCESS_TOKEN` | Server-side Mapbox token (directions API) |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Client-side Mapbox token (autocomplete) |
| `OPENWEATHER_API_KEY` | OpenWeather API key (weather-based pricing) |

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com) — it auto-detects Next.js. Add your environment variables in the Vercel dashboard under Settings → Environment Variables.
