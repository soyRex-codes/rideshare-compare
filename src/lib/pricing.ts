// ─────────────────────────────────────────────────────────────────────────────
// Rideshare Pricing Engine
// ─────────────────────────────────────────────────────────────────────────────
// Sources:
//   - Ridester 2026 analysis: avg Uber cost ~$1-2/mile, ~$0.40/min
//   - Uber fare formula: (base + time_rate + distance_rate) × surge + fees
//   - Lyft city rate cards (NYC $1.75/mi, Chicago $0.81/mi, etc.)
//   - Booking/service fees are NOT subject to surge multiplier
//
// We use national median rates derived from cross-city averages.
// ─────────────────────────────────────────────────────────────────────────────

const UBER_RATES = {
  base: 1.55,           // Base fare (national median for UberX)
  perMile: 1.45,        // Per-mile charge (avg of $1-2 range across US cities)
  perMinute: 0.38,      // Per-minute charge (avg ~$0.40, Uber slightly lower)
  bookingFee: 2.55,     // Booking/platform fee (not subject to surge)
  serviceFee: 1.85,     // Separate service fee charged by platform
  minimumFare: 5.00,    // Minimum fare (most markets $7-9)
  longTripThresholdMiles: 30,
  longTripPerMileDiscount: 0.15, // Per-mile rate drops ~10-15% on 30+ mi trips
};

const LYFT_RATES = {
  base: 1.42,           // Base fare (Lyft slightly lower base in most markets)
  perMile: 1.52,        // Per-mile charge (Lyft often marginally higher/mi)
  perMinute: 0.34,      // Per-minute charge (Lyft usually slightly lower/min)
  bookingFee: 2.75,     // Booking/platform fee
  serviceFee: 2.05,     // Service fee (Lyft typically charges a bit more here)
  minimumFare: 5.00,    // Minimum fare
  longTripThresholdMiles: 30,
  longTripPerMileDiscount: 0.12,
};

/**
 * Uber's actual fare formula:
 *   metered_fare = base + (distance × per_mile) + (duration × per_minute)
 *   surge_fare   = metered_fare × surge_multiplier × weather_multiplier
 *   total        = surge_fare + booking_fee + service_fee
 *   final        = max(total, minimum_fare)
 *
 * The low/high range models real-world variance from:
 *   - Route efficiency (GPS vs actual path taken)
 *   - Minor traffic fluctuations not in the Mapbox estimate
 *   - Platform-side adjustments
 * Short trips: ±8%, Medium trips: ±12%, Long trips: ±18%
 */
function calculateEstimate(
  rates: typeof UBER_RATES,
  distanceMiles: number,
  durationMinutes: number,
  surgeMultiplier: number,
  weatherMultiplier: number
) {
  // Apply long-trip discount if applicable
  let effectivePerMile = rates.perMile;
  if (distanceMiles > rates.longTripThresholdMiles) {
    effectivePerMile -= rates.longTripPerMileDiscount;
  }

  // Core metered fare (what the driver "earns" before platform cut)
  const meteredFare =
    rates.base +
    distanceMiles * effectivePerMile +
    durationMinutes * rates.perMinute;

  // Surge and weather apply to the metered portion ONLY, not to platform fees
  const surgedFare = meteredFare * surgeMultiplier * weatherMultiplier;

  // Platform fees are fixed — not affected by surge
  const totalFare = surgedFare + rates.bookingFee + rates.serviceFee;

  // Enforce minimum fare
  const fare = Math.max(totalFare, rates.minimumFare);

  // Variance range based on trip length
  let variancePct: number;
  if (distanceMiles < 5) {
    variancePct = 0.08; // Short trips: ±8%
  } else if (distanceMiles < 20) {
    variancePct = 0.12; // Medium trips: ±12%
  } else {
    variancePct = 0.18; // Long trips: ±18%
  }

  return {
    low: Number((fare * (1 - variancePct)).toFixed(2)),
    high: Number((fare * (1 + variancePct)).toFixed(2)),
  };
}

export function calculateUberEstimate(
  distanceMiles: number,
  durationMinutes: number,
  surgeMultiplier: number,
  weatherMultiplier: number
) {
  return calculateEstimate(
    UBER_RATES,
    distanceMiles,
    durationMinutes,
    surgeMultiplier,
    weatherMultiplier
  );
}

export function calculateLyftEstimate(
  distanceMiles: number,
  durationMinutes: number,
  surgeMultiplier: number,
  weatherMultiplier: number
) {
  return calculateEstimate(
    LYFT_RATES,
    distanceMiles,
    durationMinutes,
    surgeMultiplier,
    weatherMultiplier
  );
}

/**
 * Time-of-day surge multiplier.
 * Based on Ridester data:
 *   - Cheapest: weekdays 9am-12pm, 2pm-4pm
 *   - Most expensive: weekday 7-9am & 4-7pm (commute), Fri/Sat late night
 *   - Holidays/events can push 5-6× but we can't predict those
 */
export function getSurgeMultiplier(date: Date): number {
  const day = date.getDay(); // 0=Sun, 6=Sat
  const hour = date.getHours();

  // Friday & Saturday late night (midnight-4AM) — bar close / party hours
  if ((day === 6 || day === 0) && hour >= 0 && hour < 4) {
    return 1.75;
  }

  // Friday evening after 9PM
  if (day === 5 && hour >= 21) {
    return 1.5;
  }

  // Saturday evening after 9PM
  if (day === 6 && hour >= 21) {
    return 1.5;
  }

  // Weekday morning rush (7-9 AM, Mon-Fri)
  if (day >= 1 && day <= 5 && hour >= 7 && hour < 9) {
    return 1.25;
  }

  // Weekday evening rush (4-7 PM, Mon-Fri) — strongest commute demand
  if (day >= 1 && day <= 5 && hour >= 16 && hour < 19) {
    return 1.35;
  }

  // Sunday evening (5-8 PM) — moderate demand spike
  if (day === 0 && hour >= 17 && hour < 20) {
    return 1.15;
  }

  // Off-peak
  return 1.0;
}

/**
 * Weather-based fare adjustment using OpenWeather condition codes.
 * Based on observed patterns: drivers stay home in bad weather → supply drops → prices rise.
 */
export function getWeatherMultiplier(weatherCode: number): number {
  const group = Math.floor(weatherCode / 100);

  switch (group) {
    case 2: return 1.30;  // Thunderstorm — significant supply drop
    case 3: return 1.10;  // Drizzle — mild impact
    case 5: // Rain
      if (weatherCode >= 502) return 1.25; // Heavy/extreme rain
      return 1.15;                          // Light/moderate rain
    case 6: // Snow
      if (weatherCode >= 602) return 1.35; // Heavy snow / blizzard conditions
      return 1.20;                          // Light snow
    case 7: return 1.10;  // Atmosphere (fog, mist) — minor impact
    default: return 1.0;  // Clear, clouds — no adjustment
  }
}

export function getWeatherDescription(weatherCode: number): string {
  const group = Math.floor(weatherCode / 100);
  switch (group) {
    case 2: return 'Thunderstorm';
    case 3: return 'Drizzle';
    case 5:
      if (weatherCode >= 502) return 'Heavy Rain';
      return 'Rain';
    case 6:
      if (weatherCode >= 602) return 'Heavy Snow';
      return 'Snow';
    case 7:
      if (weatherCode === 741) return 'Fog';
      return 'Haze';
    case 8:
      if (weatherCode === 800) return 'Clear';
      if (weatherCode <= 802) return 'Partly Cloudy';
      return 'Overcast';
    default: return 'Clear';
  }
}
