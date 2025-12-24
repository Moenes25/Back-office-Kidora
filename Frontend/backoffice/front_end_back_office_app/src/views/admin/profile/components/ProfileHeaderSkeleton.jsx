import React from "react";

<<<<<<< HEAD
const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

const ProfileHeaderSkeleton = () => {
  return (
    <div className="overflow-hidden shadow-2xl rounded-2xl">
      <div className="bg-gray-300 h-36" />

      <div className="relative p-6 bg-white">
        <SkeletonBlock className="absolute rounded-full -top-14 left-6 h-28 w-28" />

        <div className="mt-10 ml-32 space-y-2">
          <SkeletonBlock className="w-40 h-5" />
          <SkeletonBlock className="w-56 h-4" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonBlock key={i} className="w-full h-20" />
=======
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
>>>>>>> safa
          ))}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};

export default ProfileHeaderSkeleton;
=======
}

>>>>>>> safa
