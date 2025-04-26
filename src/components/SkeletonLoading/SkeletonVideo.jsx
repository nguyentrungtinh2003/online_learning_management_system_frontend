import React from "react";
import { Skeleton } from "@mui/material";

export default function SkeletonVideo() {
  return (
    <div className="w-full h-screen">
      {/* Video khung */}
      <Skeleton
  animation="wave"
  variant="rectangular"
  sx={{
    width: '100%',
    height: '70%',
    borderRadius: '0.5rem', // rounded-lg
    marginBottom: '1.5rem' // mb-6
  }}
/>


      {/* Text bên dưới */}
      <div className="space-y-4">
        <Skeleton animation="wave" variant="text" className="h-60 w-1/2" />
        <Skeleton animation="wave" variant="rectangular" className="h-10 w-1/3" />
        <Skeleton animation="wave" variant="text" className="h-4 w-1/4" />
        <Skeleton animation="wave" variant="text" className="h-4 w-3/4" />
        <Skeleton animation="wave" variant="text" className="h-4 w-2/3" />
        <Skeleton animation="wave" variant="text" className="h-4 w-1/2" />
        <Skeleton animation="wave" variant="text" className="h-4 w-1/3" />
      </div>
    </div>
  );
}
