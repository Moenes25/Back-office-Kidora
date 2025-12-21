import React from "react";

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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
