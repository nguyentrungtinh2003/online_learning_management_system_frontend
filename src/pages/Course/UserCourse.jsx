import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  

  return (
    <div className="flex-1 min-h-screen bg-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Your Enrolled Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-gray-600 text-center">No courses enrolled.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((item, index) => {
              const lessons = item.course.lessons || [];
              const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
              const totalLessons = lessons.length;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
                >
                  <img
                    src={item.course.img || "/default.jpg"}
                    alt={item.course.name}
                    className="h-40 w-full object-cover rounded-t-2xl"
                  />
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
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
                          <FaClock className="text-orange-500" /> {totalDuration} min
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Enrolled:</span>{" "}
                        <span className="text-blue-600">
                          {new Date(item.enrolledDate).toLocaleDateString("vi-VN")}
                        </span>
                      </p>
                      {lessons.length > 0 && (
                        <>
                          <div className="mt-3">
                          </div>
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700">Lesson list:</p>
                            <ul className="max-h-32 overflow-y-auto text-sm text-gray-700 space-y-1 mt-1">
                              {lessons.map((lesson, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <FaVideo className="text-blue-500" />
                                  <span className="truncate flex-1">{lesson.name}</span>
                                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                                    <FaClock className="text-gray-400" /> {lesson.duration || 0} min
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/view-lesson/${item.course.id}`)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl"
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
    </div>
  );
}