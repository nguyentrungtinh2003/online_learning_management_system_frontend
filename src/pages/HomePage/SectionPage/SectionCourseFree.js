import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";

export default function SectionCourseFree() {
  // Dữ liệu giả định cho các khóa học
  // Fetch danh sách khóa học từ API
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .get(`${URL}/api/courses/all`)
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);
  return (
    <section id="section-course-free" className="py-12 bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-cyan-500 mb-8">
          Free Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={course.img}
                alt={course.courseName}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {course.courseName}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {course.description}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {course.lessons?.length} lessons
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lecturer {course.user?.username}
                </p>
                <button className="mt-4 w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-400 transition duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
