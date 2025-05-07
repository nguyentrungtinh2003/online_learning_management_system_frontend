import React, { useState, useEffect } from "react";
import { userEnroll } from "../../services/courseapi";
import { useNavigate } from "react-router-dom";

export default function UserCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // NEW: toggle to show more
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "en";

  const translations = {
    en: {
      enrolledCourses: "Your Enrolled Courses",
      noCourses: "No courses enrolled.",
      continueLearning: "Continue Learning",
      noDescription: "No description",
      enrolled: "Enrolled",
      showMore: "Show More",
      showLess: "Show Less",
    },
    vi: {
      enrolledCourses: "Khóa học bạn đã tham gia",
      noCourses: "Bạn chưa tham gia khóa học nào.",
      continueLearning: "Tiếp tục học",
      noDescription: "Không có mô tả",
      enrolled: "Ngày tham gia",
      showMore: "Hiển thị thêm",
      showLess: "Thu gọn",
    },
  };

  const t = translations[language];

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

  const formatDate = (dateArray) => {
    const enrolledDate = new Date(...dateArray);
    return enrolledDate.toLocaleDateString("vi-VN");
  };

  const displayedCourses = showAll ? courses : courses.slice(0, 8);

  return (
    <div className="w-full h-full py-6 px-4">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
            {t.enrolledCourses}
          </h1>

          {courses.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-darkText">
              {t.noCourses}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCourses.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-darkSubbackground rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <img
                      src={item.img || "/default.jpg"}
                      alt={item.courseName}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-lg font-semibold truncate">
                        {item.courseName}
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                        {item.description || t.noDescription}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-darkSubtext">
                        <strong>{t.enrolled}: </strong>
                        <span className="text-blue-600">
                          {formatDate(item.enrolledDate)}
                        </span>
                      </p>

                      <button
                        onClick={() =>
                          navigate(`/view-lesson/${item.courseId}`)
                        }
                        className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 hover:scale-105 shadow"
                      >
                        🚀 {t.continueLearning}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {courses.length > 8 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {showAll ? t.showLess : t.showMore}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
