export default function WalletLoading() {
  return (
    <div role="status" className="space-y-5 px-2 pt-3 pb-10">
      <span className="sr-only">در حال دریافت اطلاعات کیف پول…</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        <div className="rounded-square bg-card-bg p-6">
          <div className="h-4 w-36 rounded-full bg-element-bg" />
          <div className="mt-4 h-10 w-3/4 rounded-xl bg-element-bg" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="h-12 rounded-full bg-element-bg" />
            <div className="h-12 rounded-full bg-element-bg" />
          </div>
        </div>
        <div className="h-5 w-32 rounded-full bg-element-bg" />
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-icon bg-card-bg p-4"
          >
            <div className="size-10 shrink-0 rounded-2xl bg-element-bg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-full bg-element-bg" />
              <div className="h-3 w-1/2 rounded-full bg-element-bg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
