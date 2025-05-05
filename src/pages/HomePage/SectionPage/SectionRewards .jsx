import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCoins,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";
import { GiMedal } from "react-icons/gi";

const SectionRewards = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  const rewardsData = [
    {
      icon: <FaDollarSign size={150} className="text-blue-600 mr-6 transform hover:scale-110 transition-all" />,
      title: language === "vi" ? "Nạp tiền & quy đổi thành xu" : "Deposit Money & Convert to Coins",
      description:
        language === "vi"
          ? "Nạp tiền để quy đổi thành xu và truy cập nội dung nâng cao, khoá học chuyên sâu và thử thách độc quyền."
          : "Deposit money to convert into coins and access premium content, advanced courses, and exclusive challenges.",
      items: [
        language === "vi" ? "Mở khoá các khoá học nâng cao, chi tiết." : "Unlock advanced courses with in-depth content.",
        language === "vi" ? "Tham gia các thử thách độc quyền." : "Participate in exclusive challenges.",
        language === "vi" ? "Nhận phần thưởng và ưu đãi đặc biệt." : "Earn special bonuses and rewards.",
      ],
      buttonText: language === "vi" ? "Nạp ngay" : "Deposit Now",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <FaCoins size={150} className="text-green-600 mr-6 transform hover:scale-110 transition-all" />,
      title: language === "vi" ? "Cách kiếm điểm & xu" : "How to Earn Points & Coins",
      description: "",
      items: [
        language === "vi"
          ? "Hoàn thành video học miễn phí để nhận điểm."
          : "Complete free learning videos to earn points.",
        language === "vi"
          ? "Tham gia bài tập (cần xu)."
          : "Participate in exercises (coins required).",
        language === "vi"
          ? "Chia sẻ kết quả lên mạng xã hội để nhận thêm xu."
          : "Share results on social media for extra coins.",
        language === "vi"
          ? "Tham gia thảo luận và hỗ trợ cộng đồng."
          : "Engage in discussions and help others.",
      ],
      buttonText: language === "vi" ? "Tìm hiểu thêm" : "Learn More",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: <FaGift size={150} className="text-red-600 mr-6 transform hover:scale-110 transition-all" />,
      title: language === "vi" ? "Phần thưởng quy đổi" : "Redeemable Rewards",
      description: "",
      items: [
        language === "vi"
          ? "Xu có thể đổi lấy các khoá học nâng cao."
          : "Coins can be exchanged for advanced courses.",
        language === "vi"
          ? "Nhận huy hiệu và huy chương cho thành tích."
          : "Earn badges and medals for achievements.",
        language === "vi"
          ? "Nhận ưu đãi giảm giá cho các khoá học tiếp theo."
          : "Get discounts on future courses and challenges.",
        language === "vi"
          ? "Quà tặng đặc biệt và phần thưởng ảo độc quyền."
          : "Special gifts and exclusive virtual rewards.",
      ],
      buttonText: language === "vi" ? "Đổi thưởng" : "Redeem Now",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    {
      icon: <GiMedal size={150} className="text-yellow-600 mr-6 transform hover:scale-110 transition-all" />,
      title: language === "vi" ? "Xếp hạng & cấp độ" : "Ranking & Levels",
      description:
        language === "vi"
          ? "Hoàn thành nhiệm vụ để nhận điểm và tham gia bảng xếp hạng, mở khoá thêm phần thưởng hấp dẫn."
          : "Earn points by completing activities and participate in ranking systems to unlock additional rewards.",
      items: [
        language === "vi"
          ? "Người học top đầu sẽ mở khoá thử thách mới."
          : "Top learners will unlock new challenges.",
        language === "vi"
          ? "Nhận huy hiệu và phần thưởng ảo đặc biệt."
          : "Earn special badges and virtual rewards.",
        language === "vi"
          ? "Thăng cấp để truy cập nội dung nâng cao hơn."
          : "Level up to access more advanced content.",
      ],
      buttonText: language === "vi" ? "Xem hạng của tôi" : "Check My Rank",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  ];

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        {language === "vi"
          ? "Hệ thống phần thưởng & điểm số"
          : "Rewards & Points System"}
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
