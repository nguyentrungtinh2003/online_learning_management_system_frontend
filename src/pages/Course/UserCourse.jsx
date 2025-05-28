import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";
import { useTranslation } from "react-i18next";

export default function UserCourse() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const handleGoToCourses = () => {
    navigate("/?scroll=true"); // ← Thêm query để kích hoạt scroll
  };

  const { t } = useTranslation("usercourse");

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
    <div key={item.courseId} className="bg-wcolor dark:text-darkText dark:bg-darkSubbackground border-2 dark:border-darkBorder border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      <img src={item.img || "/default.jpg"} alt={item.courseName} className="h-40 w-full object-cover" />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-3xl lg:text-xl font-semibold truncate mb-1">
          {item.courseName}
        </h2>
        <div
          className="text-xl lg:text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug h-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: item.description || t("noDescription"),
          }}
        />
        <div className="flex flex-wrap items-center gap-2 text-xs my-2">
          <span className={`px-2 py-1 text-lg lg:text-xs rounded-full font-medium ${item.progressPercent === 100 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {item.progressPercent === 100 ? "✅ " + t("completedLabel") : "⏳ " + t("incompleteLabel")}
          </span>
          {item.progressPercent < 20 && (
            <span className="bg-blue-100 text-lg lg:text-xs text-blue-700 px-2 py-1 rounded-full font-medium">
              🆕 {t("newLabel")}
            </span>
          )}
          {item.progressPercent >= 80 && item.progressPercent < 100 && (
            <span className="bg-purple-100 text-lg lg:text-xs text-purple-700 px-2 py-1 rounded-full font-medium">
              🔥 {t("almostLabel")}
            </span>
          )}
        </div>
        <p className="text-xl lg:text-xs dark:text-darkSubtext mb-2">
          <strong>{t("enrolled")}:</strong> <span className="text-fcolor">{/* Format date if needed */}</span>
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-3" title={`${item.progressPercent}%`}>
          <div className="h-full bg-blue-500 transition-all duration-500 ease-in-out" style={{ width: `${item.progressPercent}%` }} />
        </div>
        {item.progressPercent === 100 ? (
          <button
            onClick={() => claimReward(item.completedLessons * 2)}
            className="mt-auto bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-not-allowed opacity-80"
          >
            🎉 {t("completedLabel")}
          </button>
        ) : (
          <button
            onClick={() => navigate(`/user-course/view-lesson/${item.courseId}`)}
            className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-xl font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300"
          >
            🚀 {t("continueLearning")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full px-4">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="px-2 h-full">
          {completedCourses.length === 0 && inProgressCourses.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-10 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
              </svg>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-darkText mb-2">
                {t("noCourses")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
                {t("noCoursesDescription")}
              </p>
              <button onClick={handleGoToCourses} className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition">
                {t("exploreCourses")}
              </button>
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b dark:border-darkBorder pb-2">
                  ✅ {t("completed")} ({completedCourses.length})
                </h2>
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map(renderCourseCard)}
                  </div>
                ) : (
                  <p className="text-center text-2xl lg:text-base h-16 text-gray-600 dark:text-darkText">{t("noCompleted")}</p>
                )}
              </section>

              <section className="mb-10 mt-10">
                <h2 className="text-5xl lg:text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b dark:border-darkBorder pb-2">
                  ⏳ {t("inProgress")} ({inProgressCourses.length})
                </h2>
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map(renderCourseCard)}
                  </div>
                ) : (
                  <p className="text-center text-2xl lg:text-base h-16 text-gray-600 dark:text-darkText">{t("noInProgress")}</p>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
