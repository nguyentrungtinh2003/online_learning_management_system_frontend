import React, { useState, useEffect } from "react";
import { userEnroll } from "../../services/courseapi";
import { useNavigate } from "react-router-dom";

export default function UserCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await userEnroll(userId);
        setCourses(data.data || []);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [userId]);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="w-full h-full py-4">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Your Enrolled Courses
          </h1>

          {courses.length === 0 ? (
            <p className="text-gray-600 dark:text-darkText text-center">No courses enrolled.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((item, index) => {
                // Lấy mảng enrolledDate từ mỗi item
                const enrolledDateArray = item.enrolledDate;

                // Tạo đối tượng Date từ mảng
                const date = new Date(
                  enrolledDateArray[0], // Năm
                  enrolledDateArray[1] - 1, // Tháng (trừ 1 vì JavaScript bắt đầu từ tháng 0)
                  enrolledDateArray[2], // Ngày
                  enrolledDateArray[3], // Giờ
                  enrolledDateArray[4], // Phút
                  enrolledDateArray[5], // Giây
                  enrolledDateArray[6] // Millisecond
                );

                // Chuyển đối tượng Date thành chuỗi ngày tháng theo định dạng vi-VN
                const formattedDate = date.toLocaleDateString("vi-VN");
                return (
                  <div
                    key={index}
                    className="bg-wcolor dark:text-darkText dark:bg-darkBackground dark:border dark:border-darkBorder rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col overflow-hidden"
                  >
                    <img
                      src={item.img || "/default.jpg"}
                      alt={item.courseName}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-xl font-semibold truncate">
                        {item.courseName}
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                        {item.description || "No description"}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-darkSubtext">
                        <span className="font-medium">Enrolled:</span>{" "}
                        <span className="text-blue-600">{formattedDate}</span>
                      </p>

                      <button
                        onClick={() =>
                          navigate(`/view-lesson/${item.courseId}`)
                        }
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 hover:scale-105 shadow-lg"
                      >
                        🚀 Continue Learning
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
