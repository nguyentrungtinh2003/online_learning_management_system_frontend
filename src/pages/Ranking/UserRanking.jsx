import React, { useState } from "react";

export default function UserRanking() {
  // Dữ liệu top
  const topDaily = [
    { rank: 1, name: "Van Tan", points: 520 },
    { rank: 2, name: "Tinh Nguyen", points: 510 },
    { rank: 3, name: "Hieu Nguyen", points: 500 },
    { rank: 4, name: "Ngoc Le", points: 495 },
    { rank: 5, name: "Minh Tran", points: 490 },
    { rank: 6, name: "Anh Pham", points: 485 },
    { rank: 7, name: "Quang Do", points: 482 },
    { rank: 8, name: "Duc Hoang", points: 478 },
    { rank: 9, name: "Linh Nguyen", points: 475 },
    { rank: 10, name: "Bao Chau", points: 470 },
    { rank: 11, name: "Tuan Vo", points: 468 },
    { rank: 12, name: "Phuong Mai", points: 465 },
    { rank: 13, name: "Khoa Bui", points: 460 },
  ];

  const topWeekly = [
    { rank: 1, name: "Tinh Nguyen", points: 1500 },
    { rank: 2, name: "Van Tan", points: 1480 },
    { rank: 3, name: "Hieu Nguyen", points: 1450 },
    { rank: 4, name: "Bao Chau", points: 1400 },
    { rank: 5, name: "Ngoc Le", points: 1350 },
    { rank: 6, name: "Anh Pham", points: 1320 },
    { rank: 7, name: "Linh Nguyen", points: 1280 },
    { rank: 8, name: "Phuong Mai", points: 1270 },
    { rank: 9, name: "Khoa Bui", points: 1250 },
    { rank: 10, name: "Tuan Vo", points: 1240 },
  ];

  const topMonthly = [
    { rank: 1, name: "Hieu Nguyen", points: 3200 },
    { rank: 2, name: "Van Tan", points: 3100 },
    { rank: 3, name: "Tinh Nguyen", points: 3050 },
    { rank: 4, name: "Ngoc Le", points: 2900 },
    { rank: 5, name: "Minh Tran", points: 2800 },
    { rank: 6, name: "Quang Do", points: 2750 },
    { rank: 7, name: "Bao Chau", points: 2700 },
    { rank: 8, name: "Duc Hoang", points: 2600 },
    { rank: 9, name: "Tuan Vo", points: 2500 },
    { rank: 10, name: "Phuong Mai", points: 2400 },
  ];

  const [selectedTop, setSelectedTop] = useState("day");

  const users =
    selectedTop === "day"
      ? topDaily
      : selectedTop === "week"
      ? topWeekly
      : topMonthly;

  const currentUser = users.find((user) => user.name === "Hieu Nguyen") || {
    rank: "-",
    name: "Hieu Nguyen",
    points: "-",
  };

  return (
    <div className="w-full dark:bg-black h-full bg-wcolor dark:text-darkText pl-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">Xếp Hạng Điểm</p>
        <div className="flex gap-2 font-semibold">
          <button
            className={`border-2 rounded-xl px-4 py-2 ${
              selectedTop === "day" ? "bg-darkBackground text-wcolor dark:bg-wcolor dark:text-darkBackground" : ""
            }`}
            onClick={() => setSelectedTop("day")}
          >
            Top Ngày
          </button>
          <button
            className={`border rounded-xl px-4 py-2 ${
              selectedTop === "week" ? "bg-darkBackground text-wcolor dark:bg-wcolor dark:text-darkBackground" : ""
            }`}
            onClick={() => setSelectedTop("week")}
          >
            Top Tuần
          </button>
          <button
            className={`border rounded-xl px-4 py-2 ${
              selectedTop === "month" ? "bg-darkBackground text-wcolor dark:bg-wcolor dark:text-darkBackground" : ""
            }`}
            onClick={() => setSelectedTop("month")}
          >
            Top Tháng
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-full overflow-auto w-full flex-1 gap-14 pl-6">
        {/* Podium */}
        <div className="relative h-full justify-center items-center">
          <div className="flex justify-center items-end ml-8 mt-20 gap-24">
            {/* Second */}
          {users[1] && (
            <div className="flex flex-col items-center">
              <div className="translate-x-1 drop-shadow-xl mb-2 skew-x-[3deg]">
                <img src="/user.png" alt="" className="w-20 h-20 rounded-full" />
                <p className="font-bold">{users[1].name}</p>
              </div>
              <div className="relative w-24 group hover:border-cyan-300">
                {/* Mặt trên */}
                <div className="bg-blue-400 rounded hover:border border-cyan-300 h-8 skew-x-[45deg] origin-left shadow-md"></div>
                <div className="bg-yellow-600 -left-6 -bottom-4 w-[140px] absolute rounded-2xl h-16 skew-x-[45deg] origin-left shadow-2xl drop-shadow-2xl"></div>
                {/* Mặt trước */}
                <div
                  className="bg-blue-300 hover:animate-blink  text-wcolor hover:text-cyan-400 hover:border-2 border-cyan-300 translate-x-4 h-28 w-[92px] flex items-center justify-center text-7xl font-bold"
                >
                  2
                </div>
                <div
                  className="bg-blue-500 shadow-2xl hover:border-2 border-cyan-300 skew-x-[45deg] rotate-[45deg] translate-y-4 h-[78px] absolute top-[18px] -left-[19px] w-[42px] flex items-center justify-center text-3xl font-bold text-white"
                />
              </div>
            </div>
          )}

          {/* First */}
          {users[0] && (
            <div className="flex flex-col items-center">
              <div className="translate-x-1 drop-shadow-xl mb-2 skew-x-[3deg]">
                <img src="/user.png" alt="" className="w-20 h-20 rounded-full" />
                <p className="font-bold overflow-x-hidden w-full">{users[0].name}</p>
              </div>
              <div className="relative w-24 group hover:border-cyan-300">
                {/* Mặt trên */}
                <div className="bg-yellow-400 rounded hover:border border-cyan-300 h-8 w-[98px] skew-x-[45deg] origin-left shadow-md"></div>
                <div className="bg-yellow-600 -left-6 -bottom-4 w-[140px] absolute rounded-2xl h-16 skew-x-[45deg] origin-left shadow-2xl drop-shadow-2xl"></div>
                {/* Mặt trước */}
                <div
                  className="bg-yellow-300 hover:animate-blink text-wcolor hover:text-cyan-400 hover:border-2 border-cyan-300 translate-x-4 h-40 w-[92px] flex items-center justify-center text-8xl font-bold"
                >
                  1
                </div>
                <div
                  className="bg-yellow-500 shadow-2xl hover:border-2 border-cyan-300 skew-x-[45deg] rotate-[45deg] translate-y-4 h-[112px] absolute top-[24px] -left-[20px] w-[42px] flex items-center justify-center text-3xl font-bold text-white"
                />
              </div>
            </div>
          )}

          {/* Third */}
          {users[2] && (
            <div className="flex flex-col items-center">
              <div className="translate-x-1 drop-shadow-xl mb-2 skew-x-[3deg]">
                <img src="/user.png" alt="" className="w-20 h-20 rounded-full" />
                <p className="font-bold">{users[2].name}</p>
              </div>
              <div className="relative w-24 group hover:border-cyan-300">
                {/* Mặt trên */}
                <div className="bg-orange-300 rounded hover:border border-cyan-300 h-8 skew-x-[45deg] origin-left shadow-md"></div>
                <div className="bg-yellow-600 -left-6 -bottom-4 w-[140px] absolute rounded-2xl h-16 skew-x-[45deg] origin-left shadow-2xl drop-shadow-2xl"></div>
                {/* Mặt trước */}
                <div
                  className="bg-orange-200 hover:animate-blink  text-wcolor hover:text-cyan-400 hover:border-2 border-cyan-300 translate-x-4 h-[80px] w-[92px] flex items-center justify-center text-6xl font-bold"
                >
                  3
                </div>
                <div
                  className="bg-orange-400 shadow-2xl hover:border-2 border-cyan-300 skew-x-[45deg] rotate-[45deg] translate-y-4 h-[56px] absolute top-[13px] -left-[19px] w-[42px] flex items-center justify-center text-3xl font-bold text-white"
                />
              </div>
            </div>
          )}
        </div>
          </div>

        {/* Ranking Table */}
        <div className="flex-1 border-2 dark:border-darkBorder mb-2 rounded-md shadow dark:bg-darkBackground bg-wcolor relative">
          <div className="h-full overflow-y-auto pb-10">
            <table className="w-full">
              <thead className="bg-wcolor dark:bg-darkBackground sticky top-0 z-10">
                <tr>
                  <th className="text-left p-2">Hạng</th>
                  <th className="text-left p-2">Ảnh</th>
                  <th className="text-left p-2">Tên</th>
                  <th className="text-left p-2">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.rank}
                    className={`${
                      user.rank === 1
                        ? "bg-yellow-100 dark:text-darkBackground"
                        : user.rank === 2
                        ? "bg-blue-100 dark:text-darkBackground"
                        : user.rank === 3
                        ? "bg-orange-100 dark:text-darkBackground"
                        : "bg-gray-50 dark:bg-darkBackground dark:hover:bg-sicolor dark:hover:text-darkBackground"
                    } border-b dark:border-darkBorder hover:bg-sicolor`}
                  >
                    <td className="p-2 px-4 font-medium">{user.rank}</td>
                    <td className="p-2">
                      <img src="/user.png" alt="" className="w-8 rounded-2xl h-8" />
                    </td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dòng "bản thân" nổi ở cuối bảng */}
          <div className="absolute bottom-0 h-10 left-0 right-0 dark:text-darkBackground bg-green-100 border-t border-green-300 shadow-inner">
            <div className="relative flex justify-around pr-32 gap-12 items-center pl-4">
              <span className="font-semibold">{currentUser.rank}</span>
              <div className="flex items-center space-x-24 w-full pl-24">
                <img src="/user.png" alt="" className="w-8 rounded-xl h-8" />
                <span className="mr-64 whitespace-nowrap">{currentUser.name}</span>
              </div>
              <span className="font-semibold">
                {currentUser.points}
              </span>

              {/* Gắn chữ “Bản thân” nổi lên */}
              <span className="absolute -top-2 left-0 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shadow">
                Bản thân
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
