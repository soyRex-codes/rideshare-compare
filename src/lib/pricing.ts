const UBER_RATES = {
  base: 1.00,
  perMile: 1.15,
  perMinute: 0.22,
  bookingFee: 2.20,
  minimumFare: 7.00
};

const LYFT_RATES = {
  base: 1.00,
  perMile: 1.09,
  perMinute: 0.18,
  bookingFee: 2.75,
  minimumFare: 6.50
};

export function calculateUberEstimate(distanceMiles: number, durationMinutes: number, surgeMultiplier: number, weatherMultiplier: number) {
  let fare = UBER_RATES.base + (distanceMiles * UBER_RATES.perMile) + (durationMinutes * UBER_RATES.perMinute);
  fare = fare * surgeMultiplier * weatherMultiplier;
  fare += UBER_RATES.bookingFee;
  if (fare < UBER_RATES.minimumFare) {
    fare = UBER_RATES.minimumFare;
  }
  return {
    low: Number(fare.toFixed(2)),
    high: Number((fare * 1.15).toFixed(2))
  };
}

export function calculateLyftEstimate(distanceMiles: number, durationMinutes: number, surgeMultiplier: number, weatherMultiplier: number) {
  let fare = LYFT_RATES.base + (distanceMiles * LYFT_RATES.perMile) + (durationMinutes * LYFT_RATES.perMinute);
  fare = fare * surgeMultiplier * weatherMultiplier;
  fare += LYFT_RATES.bookingFee;
  if (fare < LYFT_RATES.minimumFare) {
    fare = LYFT_RATES.minimumFare;
  }
  return {
    low: Number(fare.toFixed(2)),
    high: Number((fare * 1.15).toFixed(2))
  };
}

export function getSurgeMultiplier(date: Date): number {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  const hours = date.getHours();

  // Late night (midnight-5AM on Friday/Saturday nights, which correspond to Sat/Sun mornings)
  if ((day === 6 || day === 0) && hours >= 0 && hours < 5) {
    return 1.5;
  }

  // Rush hours (7-9AM or 4-7PM on weekdays Mon-Fri)
  if (day >= 1 && day <= 5) {
    if ((hours >= 7 && hours < 9) || (hours >= 16 && hours < 19)) {
      return 1.25;
    }
  }

  return 1.0;
}

export function getWeatherMultiplier(weatherCode: number): number {
  const firstDigit = Math.floor(weatherCode / 100);
  if (firstDigit === 2) return 1.25; // Thunderstorm
  if (firstDigit === 3 || firstDigit === 5) return 1.15; // Drizzle/Rain
  if (firstDigit === 6) return 1.25; // Snow
  return 1.0;
}

export function getWeatherDescription(weatherCode: number): string {
  const firstDigit = Math.floor(weatherCode / 100);
  if (firstDigit === 2) return 'Thunderstorm';
  if (firstDigit === 3 || firstDigit === 5) return 'Rain';
  if (firstDigit === 6) return 'Snow';
  if (firstDigit === 8) {
    if (weatherCode === 800) return 'Clear';
    return 'Cloudy';
  }
  return 'Clear';
}
