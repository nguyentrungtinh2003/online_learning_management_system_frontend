import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";

export default function UserCourse() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "vi";

  const translations = {
    en: {
      enrolledCourses: "Your Enrolled Courses",
      noCourses: "You haven't enrolled in any course yet.",
      continueLearning: "Continue Learning",
      noDescription: "No description",
      enrolled: "Enrolled",
      showMore: "Show More",
      showLess: "Show Less",
      completed: "Completed Courses",
      inProgress: "In Progress Courses",
      noCompleted: "No completed courses.",
      noInProgress: "No courses in progress.",
    },
    vi: {
      enrolledCourses: "Khóa học bạn đã tham gia",
      noCourses: "Bạn chưa tham gia khóa học nào.",
      continueLearning: "Tiếp tục học",
      noDescription: "Không có mô tả",
      enrolled: "Ngày tham gia",
      showMore: "Hiển thị thêm",
      showLess: "Thu gọn",
      completed: "Khóa học đã hoàn thành",
      inProgress: "Khóa học đang học",
      noCompleted: "Không có khóa học nào hoàn thành.",
      noInProgress: "Không có khóa học nào đang học.",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchCoursesProgress = async () => {
      try {
        const response = await axios.get(
          `${URL}/user/${parseInt(userId)}/courses-progress`,
          {
            withCredentials: true,
          }
        );

        const data = response.data.data || [];

        // Tính toán lại để phân chia
        const completed = data.filter(
          (course) => course.progressPercent === 100
        );
        const inProgress = data.filter(
          (course) => course.progressPercent < 100
        );

        // Gắn lại giá trị progress để dùng hiển thị
        const format = (courses) =>
          courses.map((item) => ({
            ...item,
            progress: item.progressPercent,
          }));

        setCompletedCourses(format(completed));
        setInProgressCourses(format(inProgress));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tiến độ khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesProgress();
  }, [userId]);

  const renderCourseCard = (item) => (
    <div
      key={item.courseId}
      className="bg-wcolor dark:text-darkText dark:bg-darkSubbackground border-2 dark:border-darkBorder border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
    >
      <img
        src={item.img || "/default.jpg"}
        alt={item.courseName}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-3xl lg:text-xl font-semibold truncate mb-1">
          {item.courseName}
        </h2>
        <p className="text-xl lg:text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug h-[2.5rem]">
          {item.description || t.noDescription}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs my-2">
          <span
            className={`px-2 py-1 text-lg lg:text-xs rounded-full font-medium ${
              item.progressPercent === 100
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.progressPercent === 100
              ? "✅ Hoàn thành"
              : "⏳ Chưa hoàn thành"}
          </span>
          {item.progressPercent < 20 && (
            <span className="bg-blue-100 text-lg lg:text-xs text-blue-700 px-2 py-1 rounded-full font-medium">
              🆕 Mới học
            </span>
          )}
          {item.progressPercent >= 80 && item.progressPercent < 100 && (
            <span className="bg-purple-100 text-lg lg:text-xs text-purple-700 px-2 py-1 rounded-full font-medium">
              🔥 Gần hoàn thành
            </span>
          )}
        </div>

        <div
          className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-3"
          title={`${item.progressPercent}%`}
        >
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{
              width: `${
                item.totalLessons > 0
                  ? (item.completedLessons / item.totalLessons) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>

        {item.progressPercent === 100 ? (
          <button
            disabled
            className="mt-auto bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-not-allowed opacity-80"
          >
            🎉 Đã hoàn thành
          </button>
        ) : (
          <button
            onClick={() => navigate(`/view-lesson/${item.courseId}`)}
            className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-xl font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300"
          >
            🚀 {t.continueLearning}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full px-4">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Completed Courses */}
          <section className="mb-8">
            <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-darkBorder">
              ✅ {t.completed} ({completedCourses.length})
            </h2>
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map(renderCourseCard)}
              </div>
            ) : (
              <p className="text-center text-2xl lg:text-base h-16 text-gray-600 dark:text-darkText">
                {t.noCompleted}
              </p>
            )}
          </section>

          {/* In-Progress Courses */}
          <section>
            <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-darkBorder">
              ⏳ {t.inProgress} ({inProgressCourses.length})
            </h2>
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map(renderCourseCard)}
              </div>
            ) : (
              <p className="text-center text-2xl lg:text-base h-16 text-gray-600 dark:text-darkText">
                {t.noInProgress}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
