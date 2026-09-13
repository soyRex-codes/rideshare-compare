import { PriceEstimate } from "@/types";

interface ResultCardProps {
  estimate: PriceEstimate;
}

const serviceConfig = {
  uber: {
    name: "Uber",
    subtitle: "UberX",
    bg: "bg-neutral-900",
    text: "text-white",
    muted: "text-neutral-400",
    badge: "bg-neutral-700 text-neutral-300",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  lyft: {
    name: "Lyft",
    subtitle: "Standard",
    bg: "bg-[#FF00BF]",
    text: "text-white",
    muted: "text-white/70",
    badge: "bg-white/20 text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 13h-2v-2h-2v2H9v-2H7v-2h2V9h2v2h2V9h2v2h2v2h-2v2z" />
      </svg>
    ),
  },
};

export default function ResultCard({ estimate }: ResultCardProps) {
  const config = serviceConfig[estimate.service];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const hasMultiplier =
    estimate.surgeMultiplier > 1 || estimate.weatherMultiplier > 1;

  return (
    <div className={`w-full rounded-xl ${config.bg} p-5 transition-transform active:scale-[0.99]`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2.5 ${config.text}`}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            {config.icon}
          </div>
          <div>
            <span className="font-semibold text-[15px]">{config.name}</span>
            <span className={`ml-1.5 text-xs ${config.muted}`}>{config.subtitle}</span>
          </div>
        </div>

        {hasMultiplier && (
          <div className="flex gap-1">
            {estimate.surgeMultiplier > 1 && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${config.badge} font-medium`}>
                {estimate.surgeMultiplier}× surge
              </span>
            )}
            {estimate.weatherMultiplier > 1 && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${config.badge} font-medium`}>
                +{Math.round((estimate.weatherMultiplier - 1) * 100)}% weather
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <p className={`text-2xl font-bold ${config.text} tracking-tight`}>
          {formatPrice(estimate.low)}
          <span className={`text-lg font-normal ${config.muted} ml-1`}>
            – {formatPrice(estimate.high)}
          </span>
        </p>
        <p className={`text-[11px] ${config.muted} mt-1 uppercase tracking-wider`}>
          Estimated fare
        </p>
      </div>
    </div>
  );
}
