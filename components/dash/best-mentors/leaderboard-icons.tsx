export function TrophyIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 3h10v6a5 5 0 0 1-10 0V3Z" fill="currentColor" fillOpacity=".12" />
      <path d="M7 5H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4m-4 2v4m-4 3h8m-6-3h4l1 3H9l1-3Z" />
    </svg>
  );
}

export function RatingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-3.5 text-amber-300"
    >
      <path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2L12 17.3l-5.7 2.9 1.1-6.2-4.5-4.4 6.3-.9L12 3Z" />
    </svg>
  );
}
