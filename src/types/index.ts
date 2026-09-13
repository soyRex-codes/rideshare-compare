export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface EstimateRequest {
  pickup: Location;
  dropoff: Location;
}

export interface PriceEstimate {
  service: 'uber' | 'lyft';
  displayName: string;
  low: number;   // lower bound in dollars
  high: number;  // upper bound in dollars
  surgeMultiplier: number;
  weatherMultiplier: number;
}

export interface TripDetails {
  distanceMiles: number;
  durationMinutes: number;
  weatherCondition: string;
}

export interface EstimateResponse {
  uber: PriceEstimate;
  lyft: PriceEstimate;
  trip: TripDetails;
}
