import React from "react";
import { Skeleton } from "@mui/material";

const SkeletonSection = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from(new Array(4)).map((_, index) => (
        <div
          key={index}
          className="w-full rounded-2xl overflow-hidden border-1 dark:border-gray-700 p-6 min-w-0"
        >
          <div className="bg-gray-200 w-full dark:bg-gray-800 rounded-md overflow-hidden">
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={192}
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="bg-gray-200 w-[80%] dark:bg-gray-800 rounded-md mt-4">
            <Skeleton
              animation="wave"
              variant="text"
              height={32}
              width="80%"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="bg-gray-200 w-[90%] dark:bg-gray-800 rounded-md mt-2">
            <Skeleton
              animation="wave"
              variant="text"
              height={24}
              width="90%"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="bg-gray-200 w-[60%] dark:bg-gray-800 rounded-md mt-2">
            <Skeleton
              animation="wave"
              variant="text"
              height={24}
              width="60%"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="bg-gray-200 w-[50%] dark:bg-gray-800 rounded-md mt-2">
            <Skeleton
              animation="wave"
              variant="text"
              height={24}
              width="50%"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="bg-gray-200 w-full dark:bg-gray-800 rounded-md mt-4 overflow-hidden">
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={40}
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonSection;
