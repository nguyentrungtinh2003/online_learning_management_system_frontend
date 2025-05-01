import React from "react";

export default function CourseManagement() {
  return (
    <div className="h-full w-full border shadow bg-white">
      <div className="flex justify-between w-full">
        <p className="text-3xl font-bold text-black">Xếp Hạng Điểm</p>
        <div className="gap-2 flex items-center font-semibold">
          <button className="border rounded-xl px-4 py-2">Top Ngày</button>
          <button className="border rounded-xl px-4 py-2">Top Tuần</button>
          <button className="border rounded-xl px-4 py-2">Top Tháng</button>
        </div>
      </div>
      <div className="flex gap-2 text-black">
        <content className="w-full">
          <div className="flex justify-center w-full gap-4">
            <div className="flex flex-col gap-8">
              <div className="flex items-center flex-col justify-end h-full">
                <div className="h-32 w-32 bg-gray-300 rounded-[50%]" />
                <p>Tinh Nguyen</p>
              </div>
              <div className="h-32 w-32 bg-stone-500 justify-center flex text-6xl font-bold text-white items-center">
                3
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-center flex-col justify-end h-full">
                <div className="h-32 w-32 bg-gray-300 rounded-[50%]" />
                <p>Van Tan</p>
              </div>
              <div className="h-80 w-32 bg-teal-500 justify-center flex text-6xl font-bold text-white items-center">
                1
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-center flex-col justify-end h-full">
                <div className="h-32 w-32 bg-gray-300 rounded-[50%]" />
                <p>Tinh Nguyen</p>
              </div>
              <div className="h-46 w-32 bg-rose-500 justify-center flex text-6xl font-bold text-white items-center">
                2
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-600 mx-[30%]" />
        </content>
        <aside className="bg-cyan-400 h-full">
          <table>
            <td></td>
          </table>
        </aside>
      </div>
    </div>
  );
}
