import { PriceEstimate, TripDetails } from "@/types";

interface ResultCardProps {
  estimate: PriceEstimate;
  trip: TripDetails;
}

const serviceConfig = {
  uber: {
    name: "Uber",
    icon: "🚗",
    gradient: "from-gray-900 to-gray-800",
    textColor: "text-white",
    accentColor: "text-gray-300",
    tagBg: "bg-gray-700",
  },
  lyft: {
    name: "Lyft",
    icon: "🚙",
    gradient: "from-pink-600 to-purple-700",
    textColor: "text-white",
    accentColor: "text-pink-200",
    tagBg: "bg-pink-500/30",
  },
};

export default function ResultCard({ estimate, trip }: ResultCardProps) {
  const config = serviceConfig[estimate.service];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const hasMultiplier =
    estimate.surgeMultiplier > 1 || estimate.weatherMultiplier > 1;

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-br ${config.gradient} p-5 
                    shadow-lg border border-white/10`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <h3 className={`text-lg font-bold ${config.textColor}`}>
            {config.name}
          </h3>
        </div>

        {hasMultiplier && (
          <div className="flex gap-1.5">
            {estimate.surgeMultiplier > 1 && (
              <span
                className={`${config.tagBg} ${config.textColor} text-xs px-2 py-1 rounded-full font-medium`}
              >
                ⚡ {estimate.surgeMultiplier}×
              </span>
            )}
            {estimate.weatherMultiplier > 1 && (
              <span
                className={`${config.tagBg} ${config.textColor} text-xs px-2 py-1 rounded-full font-medium`}
              >
                🌧 +{Math.round((estimate.weatherMultiplier - 1) * 100)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className={`text-3xl font-extrabold ${config.textColor}`}>
          {formatPrice(estimate.low)}
          <span className={`text-xl font-normal ${config.accentColor}`}>
            {" "}
            – {formatPrice(estimate.high)}
          </span>
        </p>
        <p className={`text-xs ${config.accentColor} mt-1`}>
          Estimated fare range
        </p>
      </div>

      {/* Trip details */}
      <div
        className={`flex items-center gap-4 text-sm ${config.accentColor} pt-3 border-t border-white/10`}
      >
        <span>📏 {trip.distanceMiles.toFixed(1)} mi</span>
        <span>⏱ {Math.round(trip.durationMinutes)} min</span>
        <span className="capitalize">☁️ {trip.weatherCondition}</span>
      </div>
    </div>
  );
}
