import React, { useState, useEffect } from "react";
import { userEnroll } from "../../services/courseapi";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaClock } from "react-icons/fa";

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
    <div className="flex-1 h-full overflow-y-auto p-6 bg-gray-50">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Your Enrolled Courses
          </h1>

          {courses.length === 0 ? (
            <p className="text-gray-600 text-center">No courses enrolled.</p>
          ) : (
            <div className="flex flex-1 gap-3">
              {courses.slice(0, 6).map((item, index) => {
                const lessons = item.course.lessons || [];
                const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
                const totalLessons = lessons.length;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col overflow-hidden"
                  >
                    <img
                      src={item.course.img || "/default.jpg"}
                      alt={item.course.name}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-blue-800 truncate">
                          {item.course.name}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.course.description || "No description"}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
                          <span className="flex items-center gap-1">
                            <FaVideo className="text-blue-500" /> {totalLessons} Lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-orange-500" /> {formatDuration(totalDuration)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Enrolled:</span>{" "}
                          <span className="text-blue-600">
                            {new Date(item.enrolledDate).toLocaleDateString("vi-VN")}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/view-lesson/${item.course.id}`)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 hover:scale-105 shadow"
                      >
                        🚀 Continue Learning
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
