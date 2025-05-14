import React, { useState } from "react";
import { FaMedal, FaCrown, FaStar } from "react-icons/fa";

export default function RankLevel() {
  const ranks = [
    { name: "BRONZE", color: "#cd7f32", points: 200 }, // 0 - 200
    { name: "SILVER", color: "#c0c0c0", points: 500 }, // 201 - 500
    { name: "GOLD", color: "#ffd700", points: 1000 }, // 501 - 1000
    { name: "PLATINUM", color: "#00bfff", points: 2000 }, // 1001 - 2000
    { name: "DIAMOND", color: "#5b12b0", points: 3000 }, // 2001+
  ];

  const [currentPoints, setCurrentPoints] = useState(
    localStorage.getItem("point") || 0
  ); // Use state for dynamic updates

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
    <div className="flex items-center">
      <div
        className="box-border border-x-4 px-24 rounded-[15%] drop-shadow-xl"
        style={{ borderColor: currentRank.color }}
      >
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
              className="h-2"
              style={{
                backgroundColor: currentRank.color,
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
