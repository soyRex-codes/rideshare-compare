export default function SkeletonCard() {
  return (
    <div className="w-full rounded-xl bg-white border border-neutral-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-20 rounded skeleton-shimmer" />
        </div>
        <div className="h-3 w-12 rounded skeleton-shimmer" />
      </div>
      <div className="h-8 w-28 rounded-md skeleton-shimmer mb-2" />
      <div className="h-3 w-16 rounded skeleton-shimmer" />
    </div>
  );
}
