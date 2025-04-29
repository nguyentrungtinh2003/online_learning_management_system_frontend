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
    <div className="w-full dark:bg-black h-full bg-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">Xếp Hạng Điểm</p>
        <div className="flex gap-2 font-semibold">
          <button
            className={`border rounded-xl px-4 py-2 ${
              selectedTop === "day" ? "bg-black text-white" : ""
            }`}
            onClick={() => setSelectedTop("day")}
          >
            Top Ngày
          </button>
          <button
            className={`border rounded-xl px-4 py-2 ${
              selectedTop === "week" ? "bg-black text-white" : ""
            }`}
            onClick={() => setSelectedTop("week")}
          >
            Top Tuần
          </button>
          <button
            className={`border rounded-xl px-4 py-2 ${
              selectedTop === "month" ? "bg-black text-white" : ""
            }`}
            onClick={() => setSelectedTop("month")}
          >
            Top Tháng
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 overflow-y-hidden">
        {/* Podium */}
        <div className="relative flex-1 flex justify-center items-end gap-4 py-4">
          <div className="absolute translate-x-6 w-full z-0 h-16 bg-cyan-300 skew-x-[45deg] rounded-2xl"/>
          {/* Second */}
          {users[1] && (
            <div className="flex flex-col items-center">
              <img src="/user.png" alt="" className="w-20 h-20 rounded-full" />
              <p className="font-semibold">{users[1].name}</p>
              <div
                className="w-24 h-24 bg-blue-300 text-white text-3xl font-bold rounded-t-xl flex justify-center items-center shadow-lg transform transition duration-300 hover:shadow-2xl hover:border-4 hover:border-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {users[1].rank}
              </div>
            </div>
          )}

          {/* First */}
          {users[0] && (
            <div className="relative w-24">
            {/* Mặt trên */}
            <div className="bg-yellow-400 rounded hover:border border-cyan-300 h-8 skew-x-[45deg] origin-left shadow-md"></div>
            {/* Mặt trước */}
            <div
              className="bg-yellow-300 rounded hover:border-2 border-cyan-300 skew--[35deg] translate-x-4 h-40 flex items-center justify-center text-3xl font-bold text-white"
            >
              1
            </div>
            <div
              className="bg-yellow-500 rounded shadow-2xl hover:border-2 border-cyan-300 skew-x-[45deg] rotate-[45deg] translate-y-4 h-[112px] absolute top-[24px] -left-[21px] w-[42px] flex items-center justify-center text-3xl font-bold text-white"
            />
          </div>
          )}

          {/* Third */}
          {users[2] && (
            <div className="flex flex-col items-center">
              <img src="/user.png" alt="" className="w-20 h-20 rounded-full" />
              <p className="font-semibold">{users[2].name}</p>
              <div className="w-24 h-20 bg-orange-400 flex justify-center items-center text-white text-3xl font-bold rounded-t-md">
                {users[2].rank}
              </div>
            </div>
          )}
        </div>

        {/* Ranking Table */}
        <div className="w-[50%] h-full max-h-full overflow-hidden border rounded-md shadow bg-white relative">
          <div className="h-full overflow-y-auto pb-20">
            <table className="w-full">
              <thead className="bg-white sticky top-0 z-10">
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
                        ? "bg-yellow-100"
                        : user.rank === 2
                        ? "bg-blue-100"
                        : user.rank === 3
                        ? "bg-orange-100"
                        : "bg-gray-50"
                    } border-b`}
                  >
                    <td className="p-2 px-4 font-medium">{user.rank}</td>
                    <td className="p-2">
                      <img src="/user.png" alt="" className="w-8 h-8" />
                    </td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dòng "bản thân" nổi ở cuối bảng */}
          <div className="absolute bottom-0 left-0 right-0 bg-green-100 border-t border-green-300 shadow-inner">
            <div className="relative grid grid-cols-[60px_48px_1fr_auto] items-center gap-4 py-2 px-4">
              <span className="font-semibold">{currentUser.rank}</span>
              <img src="/user.png" alt="" className="w-8 h-8" />
              <span className="ml-10">{currentUser.name}</span>
              <span className="font-semibold mr-[67px]">
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
