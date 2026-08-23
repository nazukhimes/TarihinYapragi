export function SkeletonLines() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl">
      {[80, 60, 90, 50, 70].map((w, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="w-3.5 h-3.5 rounded-full bg-panel-2 mt-1.5" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-panel-2 rounded-sm" style={{ width: `${w}%` }} />
            <div className="h-3 bg-panel-2 rounded-sm w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="animate-pulse grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-52 rounded-sm bg-panel-2 border border-line" />
      ))}
    </div>
  );
}
