import React from "react";
import {
  FaDollarSign,
  FaCoins,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";
import { GiMedal } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const SectionRewards = () => {
  const { t } = useTranslation("homepage");

  const rewardsData = [
    {
      icon: <FaDollarSign size={150} className="text-blue-600 mr-6 transform hover:scale-110 transition-all" />,
      title: t("rewards.depositTitle"),
      description: t("rewards.depositDesc"),
      items: [
        t("rewards.depositItem1"),
        t("rewards.depositItem2"),
        t("rewards.depositItem3"),
      ],
      buttonText: t("rewards.depositButton"),
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <FaCoins size={150} className="text-green-600 mr-6 transform hover:scale-110 transition-all" />,
      title: t("rewards.earnTitle"),
      description: "",
      items: [
        t("rewards.earnItem1"),
        t("rewards.earnItem2"),
        t("rewards.earnItem3"),
        t("rewards.earnItem4"),
      ],
      buttonText: t("rewards.earnButton"),
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: <FaGift size={150} className="text-red-600 mr-6 transform hover:scale-110 transition-all" />,
      title: t("rewards.redeemTitle"),
      description: "",
      items: [
        t("rewards.redeemItem1"),
        t("rewards.redeemItem2"),
        t("rewards.redeemItem3"),
        t("rewards.redeemItem4"),
      ],
      buttonText: t("rewards.redeemButton"),
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    {
      icon: <GiMedal size={150} className="text-yellow-600 mr-6 transform hover:scale-110 transition-all" />,
      title: t("rewards.rankTitle"),
      description: t("rewards.rankDesc"),
      items: [
        t("rewards.rankItem1"),
        t("rewards.rankItem2"),
        t("rewards.rankItem3"),
      ],
      buttonText: t("rewards.rankButton"),
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  ];

  return (
    <div className="p-6 rounded-lg">
      <h2 className="lg:text-3xl lg:py-0 py-4 text-4xl font-bold text-center mb-8 text-blue-600">
        {t("rewards.title")}
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
              {reward.buttonText}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionRewards;
