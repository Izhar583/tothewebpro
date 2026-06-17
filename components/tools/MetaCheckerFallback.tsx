import { MetaCheckerLandingPage } from "./MetaCheckerLandingPage";

export function MetaCheckerFallback() {
  return (
    <div className="space-y-8">
      {/* Interactive Form Skeleton */}
      <div className="space-y-8 animate-pulse">
        {/* Skeleton Header Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-slate-100 rounded-xl" />
            <div className="h-10 w-32 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* URL Input Form Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-slate-100 rounded" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 flex-1 bg-slate-50 border border-orange-50/50 rounded-xl" />
            <div className="h-11 w-full sm:w-24 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title Area */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
              <div className="h-[76px] bg-slate-50 border border-orange-50/50 rounded-xl" />
            </div>

            {/* Display URL Area */}
            <div className="space-y-2">
              <div className="h-4 w-44 bg-slate-100 rounded" />
              <div className="h-11 bg-slate-50 border border-orange-50/50 rounded-xl" />
            </div>
          </div>

          {/* Description Area */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
            <div className="h-24 bg-slate-50 border border-orange-50/50 rounded-xl" />
          </div>

          {/* Copy Buttons */}
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-slate-100 rounded-lg" />
            <div className="h-10 w-36 bg-slate-100 rounded-lg" />
          </div>
        </div>

        {/* SERP Preview Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-28 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-slate-100 rounded-lg" />
              <div className="h-8 w-16 bg-slate-100 rounded-lg" />
            </div>
          </div>
          <div className="h-[148px] max-w-[648px] bg-slate-50 border border-orange-50/50 rounded-xl" />
        </div>
      </div>

      {/* Static Landing Page (fully interactive) */}
      <MetaCheckerLandingPage />
    </div>
  );
}
