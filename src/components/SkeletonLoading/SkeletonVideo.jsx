import React from "react";

export default function SkeletonVideo() {
  return (
    <div className="w-full h-screen animate-pulse">
      {/* Video khung */}
      <div className="w-full h-[70%] bg-gray-300 rounded-lg flex items-center justify-center mb-6">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Text bên dưới */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2" /> {/* Lesson title */}
        <div className="h-10 bg-gray-300 rounded w-1/3" /> {/* Ghi chú button */}
        <div className="h-4 bg-gray-300 rounded w-1/4" /> {/* Update info */}
        <div className="h-4 bg-gray-300 rounded w-3/4" /> {/* Mô tả */}
        <div className="h-4 bg-gray-300 rounded w-2/3" /> {/* Link 1 */}
        <div className="h-4 bg-gray-300 rounded w-1/2" /> {/* Link 2 */}
        <div className="h-4 bg-gray-300 rounded w-1/3" /> {/* Link 3 */}
      </div>
    </div>
  );
}
