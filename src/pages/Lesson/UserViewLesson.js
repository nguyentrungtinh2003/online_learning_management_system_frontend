import React from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

export default function UserViewLesson() {
  const lessons = [
    { title: "Khái niệm cần biết", duration: "11:35" },
    { title: "Cấu trúc cơ bản", duration: "09:20" },
    { title: "Biến và kiểu dữ liệu", duration: "12:45" },
  ];

  return (
    <div className="flex-1 py-3 text-sm font-semibold box-border">
      <div className="h-screen bg-white flex-row p-4">
        <div className="flex gap-4">
          <div className="flex-1 ">
            <video className="h-[50%] w-full bg-gray-400 rounded-lg" />
            <div className="space-y-2">
              <div className="flex w-full justify-between my-4">
                <h1 className="font-bold text-2xl">
                  Mô hình Client - Server là gì?
                </h1>
                <button className="bg-scolor border py-2 px-10 hover:shadow duration-700 rounded-xl">
                  Thêm ghi chú tại 00:00:00
                </button>
              </div>
              <h2>Cập nhật tháng 11 năm 2024</h2>
              <p className="text-lg">
                Tham gia cộng đồng để cùng học hỏi, chia sẻ và “Thám thính” xem
                Code Arena có gì mới nhé
              </p>
              <ul>
                <li>Fanpage: http://psdvsnv.com</li>
                <li>Group: http://psdvsnv.com</li>
                <li>Youtube: http://psdvsnv.com</li>
              </ul>
            </div>
          </div>
          <div className="shadow h-full px-8 py-4 space-y-4 rounded-xl">
            <p className="text-2xl">Nội dung khóa học</p>
            {lessons.map((lesson, index) => (
              <div key={index}>
                <h1>{lesson.title}</h1>
                <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {lesson.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="font-bold flex gap-4 w-full justify-center">
            <button className="border flex items-center gap-2 py-2 px-8 rounded-xl duration-500 hover:bg-scolor">
              <MdNavigateBefore size={20} />
              Bài trước
            </button>
            <button className="border flex items-center gap-2 duration-500 hover:bg-scolor py-2 px-8 rounded-xl">
              Bài Sau
              <MdNavigateNext size={20} />
            </button>
          </div>
          <p className="flex-end w-fit whitespace-nowrap">
            1.Khái niệm kỹ thuật cần biết
          </p>
        </div>
      </div>
    </div>
  );
}
