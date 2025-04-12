import React, { useState, useEffect } from "react";
import RankLevel from "./RankLevel";

export default function LevelUp() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    isVisible && (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-md">
        {/* Nội dung của modal level up */}
        <h2>Level Up!</h2>
        <p>Bạn đã đạt cấp độ mới!</p>
        <RankLevel/>
      </div>
    )
  );
}
