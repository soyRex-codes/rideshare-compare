export default function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      {/* Service name skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="h-5 w-24 rounded-md skeleton-shimmer" />
      </div>

      {/* Price skeleton */}
      <div className="h-9 w-36 rounded-lg skeleton-shimmer mb-3" />

      {/* Trip details skeleton */}
      <div className="flex gap-4">
        <div className="h-4 w-20 rounded skeleton-shimmer" />
        <div className="h-4 w-24 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}
