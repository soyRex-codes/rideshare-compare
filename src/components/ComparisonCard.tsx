import { PriceEstimate } from "@/types";
import Link from "next/link";

interface ComparisonCardProps {
  uber: PriceEstimate;
  lyft: PriceEstimate;
  pickupAddress?: string;
  dropoffAddress?: string;
}

const DISCOUNT = 0.30; // 30% off

export default function ComparisonCard({ uber, lyft, pickupAddress, dropoffAddress }: ComparisonCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const getMidpoint = (est: PriceEstimate) => (est.low + est.high) / 2;
  const uberMid = getMidpoint(uber);
  const lyftMid = getMidpoint(lyft);
  
  // Rido discount is 30% off the CHEAPER of the two
  const cheaperMid = Math.min(uberMid, lyftMid);
  const ridoPrice = cheaperMid * (1 - DISCOUNT);

  let bookUrl = "/drivers";
  if (pickupAddress || dropoffAddress) {
    const params = new URLSearchParams();
    if (pickupAddress) params.append("pickup", pickupAddress);
    if (dropoffAddress) params.append("dropoff", dropoffAddress);
    bookUrl = `/drivers?${params.toString()}`;
  }

  const hasUberMultiplier = uber.surgeMultiplier > 1 || uber.weatherMultiplier > 1;
  const hasLyftMultiplier = lyft.surgeMultiplier > 1 || lyft.weatherMultiplier > 1;

  return (
    <div className="w-full rounded-2xl bg-white border border-neutral-100 shadow-xl shadow-black/[0.03] overflow-hidden">
      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-2 divide-x divide-neutral-100">
        
        {/* Uber Side */}
        <div className="p-4 bg-neutral-900 text-white relative overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[11px] font-bold">
                  U
                </div>
                <span className="font-semibold text-[14px]">UberX</span>
              </div>

              {hasUberMultiplier && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {uber.surgeMultiplier > 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 font-medium">
                      {uber.surgeMultiplier}× surge
                    </span>
                  )}
                  {uber.weatherMultiplier > 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 font-medium">
                      +{Math.round((uber.weatherMultiplier - 1) * 100)}% weather
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mb-0.5">Est. Price</p>
              <p className="text-[17px] font-bold tracking-tight">
                {formatPrice(uber.low)} – {formatPrice(uber.high)}
              </p>
            </div>
          </div>
        </div>

        {/* Lyft Side */}
        <div className="p-4 bg-[#FF00BF] text-white relative overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-[11px] font-bold">
                  L
                </div>
                <span className="font-semibold text-[14px]">Lyft</span>
              </div>

              {hasLyftMultiplier && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {lyft.surgeMultiplier > 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">
                      {lyft.surgeMultiplier}× surge
                    </span>
                  )}
                  {lyft.weatherMultiplier > 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">
                      +{Math.round((lyft.weatherMultiplier - 1) * 100)}% weather
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider mb-0.5">Est. Price</p>
              <p className="text-[17px] font-bold tracking-tight">
                {formatPrice(lyft.low)} – {formatPrice(lyft.high)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Rido CTA Section */}
      <div className="p-4 bg-white">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 mb-1 text-green-600 font-bold text-[13px] uppercase tracking-wide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Rido Special
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-green-700 tracking-tight">{formatPrice(ridoPrice)}</span>
            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">30% Off</span>
          </div>

          <Link
            href={bookUrl}
            className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all
                       text-white text-[14px] font-bold py-3 rounded-lg shadow-lg shadow-green-600/20"
          >
            Book with Rido partners →
          </Link>
          <p className="text-[11px] text-green-700/60 font-medium mt-2">
            Save 30% off the cheapest alternative.
          </p>
        </div>
      </div>
    </div>
  );
}
