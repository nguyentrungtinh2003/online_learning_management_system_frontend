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
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Podium */}
        <div className="flex-1 flex justify-center items-end gap-4">
          {/* Second */}
          {users[1] && (
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-300 rounded-full mb-2" />
              <p className="font-semibold">{users[1].name}</p>
              <div className="w-24 h-24 bg-blue-300 flex justify-center items-center text-white text-3xl font-bold rounded-t-md">
                {users[1].rank}
              </div>
            </div>
          )}

          {/* First */}
          {users[0] && (
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24 bg-gray-300 rounded-full mb-2">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-2xl">
                  👑
                </div>
              </div>
              <p className="font-semibold">{users[0].name}</p>
              <div className="w-24 h-40 bg-yellow-400 flex justify-center items-center text-white text-3xl font-bold rounded-t-md">
                {users[0].rank}
              </div>
            </div>
          )}

          {/* Third */}
          {users[2] && (
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-300 rounded-full mb-2" />
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
                      <div className="w-8 h-8 bg-gray-400 rounded-full" />
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
              <div className="ml-6 w-8 h-8 bg-gray-400 rounded-full" />
              <span className="ml-[42px]">{currentUser.name}</span>
              <span className="font-semibold mr-[67px]">{currentUser.points}</span>

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
