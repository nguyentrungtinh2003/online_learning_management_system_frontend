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
  const language = localStorage.getItem("language") || "en";

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
      completedLabel: "Completed",
      newLabel: "New",
      almostLabel: "Almost done",
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
      completedLabel: "Hoàn thành",
      newLabel: "Mới",
      almostLabel: "Gần xong",
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

        const courseList = response.data.data || [];

        const updatedCourses = courseList.map((course) => {
          const progressPercent =
            course.totalLessons > 0
              ? Math.round(
                  (course.completedLessons / course.totalLessons) * 100
                )
              : 0;

          return {
            ...course,
            progress: progressPercent,
          };
        });

        setCompletedCourses(updatedCourses.filter((c) => c.progress === 100));
        setInProgressCourses(updatedCourses.filter((c) => c.progress < 100));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tiến độ khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesProgress();
  }, [userId]);

  const claimReward = (point) => {
    axios
      .post(`${URL}/claim-reward/${userId}/${parseInt(point)}`)
      .then((response) => {
        alert("Reward success");
      })
      .catch((error) => {
        alert("Fail claim reward");
      });
  };

  const renderCourseCard = (item) => (
    <div
      key={item.courseId}
      className="bg-wcolor dark:text-darkText dark:bg-darkSubbackground border-2 dark:border-darkBorder border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
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

        <div
          className="text-xl lg:text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug h-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: item.description || t.noDescription,
          }}
        ></div>

        <div className="flex flex-wrap items-center gap-2 text-xs my-2">
          <span
            className={`px-2 py-1 text-lg lg:text-xs rounded-full font-medium ${
              item.progressPercent === 100
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.progressPercent === 100
              ? "✅ " + t.completedLabel
              : "⏳ Chưa hoàn thành"}
          </span>

          {item.progressPercent < 20 && (
            <span className="bg-blue-100 text-lg lg:text-xs text-blue-700 px-2 py-1 rounded-full font-medium">
              🆕 {t.newLabel}
            </span>
          )}

          {item.progressPercent >= 80 && item.progressPercent < 100 && (
            <span className="bg-purple-100 text-lg lg:text-xs text-purple-700 px-2 py-1 rounded-full font-medium">
              🔥 {t.almostLabel}
            </span>
          )}
        </div>

        <p className="text-xl lg:text-xs dark:text-darkSubtext mb-2">
          <strong>{t.enrolled}: </strong>
          <span className="text-fcolor">
            {/* {new Date(...item.enrolledDate).toLocaleDateString("vi-VN")} */}
          </span>
        </p>

        <div
          className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-3"
          title={`${item.progressPercent}%`}
        >
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{
              width: `${item.progressPercent}%`,
            }}
          ></div>
        </div>

        {item.progressPercent === 100 ? (
          <button
            onClick={() => claimReward(item.completedLessons * 2)}
            className="mt-auto bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-not-allowed opacity-80"
          >
            🎉 {t.completedLabel}
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(`/user-course/view-lesson/${item.courseId}`)
            }
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
        <div className="px-2">
          {completedCourses.length === 0 && inProgressCourses.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-darkText text-2xl">
              {t.noCourses}
            </p>
          ) : (
            <>
              {/* Completed Courses */}
              <section>
                <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b dark:border-darkBorder pb-2">
                  ✅ {t.completed} ({completedCourses.length})
                </h2>
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map((item) => renderCourseCard(item))}
                  </div>
                ) : (
                  <p className="text-center text-2xl lg:text-base h-16 text-gray-600 dark:text-darkText">
                    {t.noCompleted}
                  </p>
                )}
              </section>

              {/* In-progress Courses */}
              <section className="mb-10 mt-10">
                <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b dark:border-darkBorder pb-2">
                  ⏳ {t.inProgress} ({inProgressCourses.length})
                </h2>
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map((item) => renderCourseCard(item))}
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
      )}
    </div>
  );
}
