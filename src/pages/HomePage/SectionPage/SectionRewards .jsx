import React from "react";
import {
  FaDollarSign,
  FaCoins,
  FaAward,
  FaTrophy,
  FaGift,
  FaArrowRight,
} from "react-icons/fa"; // Import more icons
import { GiMedal } from "react-icons/gi";

const SectionRewards = () => {
  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Rewards & Points System
      </h2>

      {/* Deposit Money and Convert to Coins */}
      <div className="gap-4 mb-8 p-6 bg-white rounded-lg shadow-lg flex items-center hover:scale-105 transition-all duration-300">
        <FaDollarSign size={150} className="text-blue-600 text-5xl mr-6 transform hover:scale-110 transition-all" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Deposit Money & Convert to Coins
          </h3>
          <p className="text-gray-700 mb-4">
            Deposit money to convert into coins and access premium content,
            advanced courses, and exclusive challenges.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Unlock advanced courses with in-depth content.</li>
            <li>Participate in exclusive challenges.</li>
            <li>Earn special bonuses and rewards.</li>
          </ul>
          <button className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center">
            Deposit Now <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* How to Earn Points and Coins */}
      <div className="gap-4 mb-8 p-6 bg-white rounded-lg shadow-lg flex items-center hover:scale-105 transition-all duration-300">
        <FaCoins size={150} className="text-green-600 text-5xl mr-6 transform hover:scale-110 transition-all" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            How to Earn Points & Coins
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Complete free learning videos to earn points.</li>
            <li>Participate in exercises (coins required).</li>
            <li>Share results on social media for extra coins.</li>
            <li>Engage in discussions and help others.</li>
          </ul>
          <button className="mt-4 py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center">
            Learn More <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Redeemable Rewards */}
      <div className="gap-4 mb-8 p-6 bg-white rounded-lg shadow-lg flex items-center hover:scale-105 transition-all duration-300">
        <FaGift size={150} className="text-red-600 text-5xl mr-6 transform hover:scale-110 transition-all" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Redeemable Rewards
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Coins can be exchanged for advanced courses.</li>
            <li>Earn badges and medals for achievements.</li>
            <li>Get discounts on future courses and challenges.</li>
            <li>Special gifts and exclusive virtual rewards.</li>
          </ul>
          <button className="mt-4 py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center">
            Redeem Now <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Ranking and Levels */}
      <div className="gap-4 p-6 bg-white rounded-lg shadow-lg flex items-center hover:scale-105 transition-all duration-300">
        <GiMedal size={150} className="text-yellow-600 text-5xl mr-6 transform hover:scale-110 transition-all" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Ranking & Levels
          </h3>
          <p className="text-gray-700 mb-4">
            Earn points by completing activities and participate in ranking
            systems to unlock additional rewards.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Top learners will unlock new challenges.</li>
            <li>Earn special badges and virtual rewards.</li>
            <li>Level up to access more advanced content.</li>
          </ul>
          <button className="mt-4 py-2 px-6 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all flex items-center">
            Check My Rank <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionRewards;
