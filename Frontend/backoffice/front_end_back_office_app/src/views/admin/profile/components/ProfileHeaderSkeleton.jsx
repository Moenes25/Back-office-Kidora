import React from "react";

const Skeleton = ({ className }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-slate-200 ${className}`}
  >
    <span className="absolute inset-0 animate-[shimmer_1.6s_infinite]
                     bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export default function ProfileHeaderSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="h-40 bg-slate-300" />

      <div className="relative p-6">
        <Skeleton className="absolute -top-16 left-6 h-32 w-32 rounded-full" />

        <div className="ml-40 mt-6 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}

