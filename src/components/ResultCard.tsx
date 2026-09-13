import { PriceEstimate } from "@/types";
import Link from "next/link";

interface ResultCardProps {
  estimate: PriceEstimate;
  pickupAddress?: string;
  dropoffAddress?: string;
}

const serviceConfig = {
  uber: {
    name: "Uber",
    subtitle: "UberX",
    bg: "bg-neutral-900",
    text: "text-white",
    muted: "text-neutral-400",
    badge: "bg-neutral-700 text-neutral-300",
  },
  lyft: {
    name: "Lyft",
    subtitle: "Standard",
    bg: "bg-[#FF00BF]",
    text: "text-white",
    muted: "text-white/70",
    badge: "bg-white/20 text-white",
  },
};

const DISCOUNT = 0.30; // 30% off

export default function ResultCard({ estimate, pickupAddress, dropoffAddress }: ResultCardProps) {
  const config = serviceConfig[estimate.service];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const hasMultiplier =
    estimate.surgeMultiplier > 1 || estimate.weatherMultiplier > 1;

  // Discounted prices (30% off the midpoint)
  const midpoint = (estimate.low + estimate.high) / 2;
  const discountedPrice = midpoint * (1 - DISCOUNT);

  let bookUrl = "/drivers";
  if (pickupAddress || dropoffAddress) {
    const params = new URLSearchParams();
    if (pickupAddress) params.append("pickup", pickupAddress);
    if (dropoffAddress) params.append("dropoff", dropoffAddress);
    bookUrl = `/drivers?${params.toString()}`;
  }

  return (
    <div className={`w-full rounded-xl ${config.bg} p-5 transition-transform active:scale-[0.99]`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2.5 ${config.text}`}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
            {estimate.service === "uber" ? "U" : "L"}
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

      {/* Price section — original crossed out + discounted */}
      <div className="mb-4">
        {/* Original price — struck through */}
        <p className={`${config.muted} line-through text-base`}>
          {formatPrice(estimate.low)} – {formatPrice(estimate.high)}
        </p>

        {/* Discounted price */}
        <div className="flex items-baseline gap-2 mt-1">
          <p className={`text-2xl font-bold ${config.text} tracking-tight`}>
            {formatPrice(discountedPrice)}
          </p>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-green-500 text-white">
            30% OFF
          </span>
        </div>
        <p className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold text-green-300 uppercase tracking-widest bg-green-400/20 px-2 py-1 rounded">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          Book with our drivers & save
        </p>
      </div>

      {/* Book with us CTA */}
      <Link
        href={bookUrl}
        className="block w-full py-2.5 rounded-lg bg-white/15 hover:bg-white/25 
                   text-center text-[13px] font-semibold text-white transition-colors
                   active:scale-[0.98]"
      >
        Book with us →
      </Link>
    </div>
  );
}
