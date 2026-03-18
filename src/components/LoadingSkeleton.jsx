export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Loading articles">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-image" />
          <div className="skeleton-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line title long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line long" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
