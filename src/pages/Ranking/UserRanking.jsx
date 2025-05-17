import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useTranslation } from "react-i18next";
import unknowAva from "../../assets/unknownAvatar.png";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const RankChangeIcon = ({ rankEnum }) => {
  if (rankEnum === "UP")
    return <ArrowUp className="text-green-400 w-5 h-5 animate-bounce" />;
  if (rankEnum === "DOWN")
    return <ArrowDown className="text-red-500 w-5 h-5 animate-bounce animation-reverse" />;
  return <Minus className="text-gray-400 w-5 h-5" />;
};

export default function UserRanking() {
  const { t } = useTranslation("ranking");
  const [topDaily, setTopDaily] = useState([]);
  const [topWeekly, setTopWeekly] = useState([]);
  const [topMonthly, setTopMonthly] = useState([]);
  const [selectedTop, setSelectedTop] = useState("day");

  useEffect(() => {
    const today = new Date();
    const date = today.toISOString().split("T")[0];

    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    fetchTopDate(date);
    fetchTopWeek(startDate, endDate);
    fetchTopMonth(month, year);
  }, []);

  const fetchTopDate = (date) => {
    axios
      .get(`${URL}/rankings/day?date=${date}`, { withCredentials: true })
      .then((response) => setTopDaily(response.data.data))
      .catch((error) => console.error("Error get top date ", error.message));
  };

  const fetchTopWeek = (start, end) => {
    axios
      .get(`${URL}/rankings/week?start=${start}&end=${end}`, { withCredentials: true })
      .then((response) => setTopWeekly(response.data.data))
      .catch((error) => console.error("Error get top week ", error.message));
  };

  const fetchTopMonth = (month, year) => {
    axios
      .get(`${URL}/rankings/month?month=${month}&year=${year}`, { withCredentials: true })
      .then((response) => setTopMonthly(response.data.data))
      .catch((error) => console.error("Error get top month ", error.message));
  };

  const listUser =
    selectedTop === "day"
      ? topDaily
      : selectedTop === "week"
      ? topWeekly
      : topMonthly;

  const currentUserId = parseInt(localStorage.getItem("id"));

  const currentUser =
    listUser.find((user) => user.user.id === currentUserId) || {
      rankEnum: "",
      user: { username: `Bạn không ở trong Top`, avatar: unknowAva },
      point: "0",
    };

  return (
    <div className="w-full px-4 py-10">
      {/* Title */}
      <h1 className="lg:text-4xl text-7xl font-extrabold dark:text-darkText text-center mb-4">
        🏆 {t("rankingTitle")} 🏆
      </h1>

      {/* Tabs for Top Day / Week / Month */}
      <div className="flex justify-center space-x-4 mb-10">
        {[
          { key: "day", label: t("topDay") || "Top Ngày" },
          { key: "week", label: t("topWeek") || "Top Tuần" },
          { key: "month", label: t("topMonth") || "Top Tháng" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTop(tab.key)}
            className={`lg:px-4 text-2xl lg:text-base px-8 py-4 lg:py-2 rounded-full font-semibold transition-all ${
              selectedTop === tab.key
                ? "dark:bg-wcolor bg-darkBackground text-wcolor dark:text-darkBackground shadow-lg"
                : "dark:bg-darkSubbackground dark:border-darkBorder border-2 text-gray-700 dark:text-wcolor hover:bg-tcolor dark:hover:bg-darkHover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-wrap justify-center items-end gap-6 mb-12">
        {[1, 0, 2].map((rank) => {
          const player = listUser[rank];
          if (!player) return null;
          const rankColors = [
            "from-yellow-400 to-orange-500",
            "from-sky-400 to-blue-600",
            "from-green-400 to-emerald-500",
          ];
          const size = rank === 0 ? "lg:w-24 lg:h-24 w-64 h-64" : "lg:w-20 lg:h-20 h-48 w-48";
          return (
            <div
              key={rank}
              className={`flex flex-col items-center bg-gradient-to-br ${rankColors[rank]} text-white p-4 rounded-2xl shadow-xl transition-transform hover:scale-105`}
            >
              <img
                src={player.user?.img || unknowAva}
                alt="avatar"
                className={`${size} rounded-full border-4 border-white shadow-md object-cover`}
              />
              <span className="mt-3 font-semibold text-2xl lg:text-lg truncate lg:max-w-[150px] text-center">
                {player.user?.username}
              </span>
              <span className="bg-white text-black text-xl lg:text-sm font-bold px-3 py-1 rounded-full mt-1 shadow-inner">
                {player.point} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="mx-auto space-y-4">
        {listUser.length > 0 ? (
          <>
            {listUser.slice(0, 50).map((player, index) => {
              const isCurrentUser = player.user.id === currentUserId;
              const rankColor =
                index === 0
                  ? "text-yellow-300"
                  : index === 1
                  ? "text-sky-300"
                  : index === 2
                  ? "text-green-300"
                  : "text-gray-300";

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center px-5 py-3 rounded-xl transition duration-300 shadow-md ${
                    isCurrentUser
                      ? "bg-blue-600 border-2 border-blue-400 font-semibold"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl lg:text-xl font-bold w-6 text-center ${rankColor}`}>
                      {index + 1}
                    </span>
                    <RankChangeIcon rankEnum={player.rankEnum} />
                    <img
                      src={player.user?.img || unknowAva}
                      alt="avatar"
                      className="lg:w-10 lg:h-10 h-16 w-16 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="text-white text-3xl lg:text-base font-medium">
                        {player.user?.username}
                      </p>
                    </div>
                  </div>
                  <div className="bg-wcolor text-black text-2xl lg:text-sm font-semibold px-4 py-1 rounded-full shadow-inner">
                    {player.point}
                  </div>
                </div>
              );
            })}

            {/* Nếu user không nằm trong top 50 thì hiển thị dòng riêng */}
            {!listUser.some((player) => player.user.id === currentUserId) && (
              <div
                className="flex justify-between items-center px-5 py-3 rounded-xl bg-blue-600 border-2 border-blue-400 font-semibold shadow-md mt-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold w-6 text-center text-gray-300">--</span>
                  <Minus className="text-gray-300 w-5 h-5" />
                  <img
                    src={currentUser.user.img || unknowAva}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-white font-medium truncate max-w-[140px]">
                      {currentUser.user.username}
                    </p>
                    <p className="text-xs text-gray-400">{t("points")}</p>
                  </div>
                </div>
                <div className="bg-white text-black text-sm font-semibold px-4 py-1 rounded-full shadow-inner">
                  {currentUser.point}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 py-10 text-4xl lg:text-lg">
            {t("noData") || "Không có dữ liệu."}
          </p>
        )}
      </div>
    </div>
  );
}
