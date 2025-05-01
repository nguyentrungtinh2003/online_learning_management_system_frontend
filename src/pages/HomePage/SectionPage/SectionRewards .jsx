import React from "react";
import {
  FaDollarSign,
  FaCoins,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";
import { GiMedal } from "react-icons/gi";

const rewardsData = [
  {
    icon: <FaDollarSign size={150} className="text-blue-600 mr-6 transform hover:scale-110 transition-all" />,
    title: "Deposit Money & Convert to Coins",
    description: "Deposit money to convert into coins and access premium content, advanced courses, and exclusive challenges.",
    items: [
      "Unlock advanced courses with in-depth content.",
      "Participate in exclusive challenges.",
      "Earn special bonuses and rewards.",
    ],
    buttonText: "Deposit Now",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    icon: <FaCoins size={150} className="text-green-600 mr-6 transform hover:scale-110 transition-all" />,
    title: "How to Earn Points & Coins",
    description: "",
    items: [
      "Complete free learning videos to earn points.",
      "Participate in exercises (coins required).",
      "Share results on social media for extra coins.",
      "Engage in discussions and help others.",
    ],
    buttonText: "Learn More",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  {
    icon: <FaGift size={150} className="text-red-600 mr-6 transform hover:scale-110 transition-all" />,
    title: "Redeemable Rewards",
    description: "",
    items: [
      "Coins can be exchanged for advanced courses.",
      "Earn badges and medals for achievements.",
      "Get discounts on future courses and challenges.",
      "Special gifts and exclusive virtual rewards.",
    ],
    buttonText: "Redeem Now",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  {
    icon: <GiMedal size={150} className="text-yellow-600 mr-6 transform hover:scale-110 transition-all" />,
    title: "Ranking & Levels",
    description: "Earn points by completing activities and participate in ranking systems to unlock additional rewards.",
    items: [
      "Top learners will unlock new challenges.",
      "Earn special badges and virtual rewards.",
      "Level up to access more advanced content.",
    ],
    buttonText: "Check My Rank",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
];

const SectionRewards = () => {
  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Rewards & Points System
      </h2>

      {rewardsData.map((reward, index) => (
        <div
          key={index}
          className="gap-4 mb-8 p-6 text-gray-700 dark:bg-darkSubbackground dark:text-darkSubtext font-semibold dark:border dark:border-darkBorder rounded-lg shadow-lg flex items-center hover:scale-[1.02] transition-all duration-300"
        >
          {reward.icon}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-darkText mb-2">
              {reward.title}
            </h3>
            {reward.description && (
              <p className="mb-4">{reward.description}</p>
            )}
            <ul className="list-disc pl-6">
              {reward.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <button
              className={`mt-4 py-2 px-6 ${reward.buttonColor} text-white rounded-lg flex items-center transition-all`}
            >
              {reward.buttonText} <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionRewards;
