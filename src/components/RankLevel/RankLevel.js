import React, { useState } from "react";
import { FaMedal, FaCrown, FaStar } from "react-icons/fa";

export default function RankLevel() {
  const ranks = [
    { name: "BRONZE", color: "#cd7f32", points: 100 },
    { name: "SILVER", color: "#c0c0c0", points: 300 },
    { name: "GOLD", color: "#ffd700", points: 500 },
    { name: "DIAMOND", color: "#00c3ff", points: 1000 },
    { name: "MASTER", color: "#ff4500", points: 1500 },
  ];

  const [currentPoints, setCurrentPoints] = useState(990); // Use state for dynamic updates

  const handlePointUpdate = (newPoints) => {
    setCurrentPoints(newPoints);
    // Update current rank if points are within the current rank's range
    if (
      newPoints >=
        getCurrentRank().points - (currentPoints % getCurrentRank().points) &&
      newPoints < getCurrentRank().points
    ) {
      getCurrentRank(); // Call to recalculate rank
    }
  };

  // Function to determine the current rank based on points
  const getCurrentRank = () => {
    let currentRankIndex = ranks.findIndex(
      (rank) => currentPoints < rank.points
    );

    // Nếu không tìm thấy cấp bậc nào phù hợp hoặc điểm quá cao, trả về cấp bậc cao nhất
    if (currentRankIndex === -1 || currentRankIndex >= ranks.length) {
      currentRankIndex = ranks.length - 1;
    }

    return ranks[currentRankIndex];
  };

  const currentRank = getCurrentRank();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-32 box-border border-x-4 px-24 rounded-[15%] border-amber-300 drop-shadow-xl">
        <FaMedal size={250} color={currentRank.color} />
        <div className="grid place-items-center">
          <p className="font-bold text-3xl mt-4 mb-2">{currentRank.name}</p>
        </div>
        <div className="grid place-items-center">
          <p>
            {currentPoints}/{currentRank.points}
          </p>
          <div className="w-[80%] border-2">
            <p
              className="h-2 bg-cyan-300"
              style={{
                width:
                  currentPoints > currentRank.points
                    ? "100%"
                    : `${(currentPoints / currentRank.points) * 100}%`,
              }}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
}
