import React from "react";
import { Skeleton } from "@mui/material";

const SkeletonSection = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from(new Array(4)).map((_, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-2xl overflow-hidden border p-6 min-w-0"
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={192}
          />
          <Skeleton
            animation="wave"
            variant="text"
            height={32}
            width="80%"
            className="mt-4"
          />
          <Skeleton
            animation="wave"
            variant="text"
            height={24}
            width="90%"
            className="mt-2"
          />
          <Skeleton
            animation="wave"
            variant="text"
            height={24}
            width="60%"
            className="mt-2"
          />
          <Skeleton
            animation="wave"
            variant="text"
            height={24}
            width="50%"
            className="mt-2"
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={40}
            className="mt-4"
          />
        </div>
      ))}
    </div>
  );
};

export default SkeletonSection;
