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
    <section id="section-course-free" className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
          Top Courses – No Payment Needed!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* {courses?.map((course) => (
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
                  {course.courseName || "Java Backend"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {course.description ||
                    "Khoá học Java Springboot API cho người mới."}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {course.lessons?.length || 60} lessons
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lecturer {course.user?.username || "Nguyen trung Tinh"}
                </p>
                <button className="mt-4 w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-400 transition duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))} */}
          <div className="bg-white font-semibold shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl">
            <img src="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">Java Backend</h3>
              <p className="text-sm text-gray-600 mt-2">
                Khoá học Java Springboot API cho người mới.
              </p>
              <p className="text-sm text-gray-600 mt-1">60 lessons</p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                Lecturer: <h1 className="text-fcolor"> Nguyen trung Tinh</h1>
              </p>
              <button className="mt-4 w-full bg-scolor text-black text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
                Enroll Now
              </button>
            </div>
          </div>
          <div className="bg-white font-semibold shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl">
            <img src="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">Java Backend</h3>
              <p className="text-sm text-gray-600 mt-2">
                Khoá học Java Springboot API cho người mới.
              </p>
              <p className="text-sm text-gray-600 mt-1">60 lessons</p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                Lecturer: <h1 className="text-fcolor"> Nguyen trung Tinh</h1>
              </p>
              <button className="mt-4 w-full bg-scolor text-black text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
                Enroll Now
              </button>
            </div>
          </div>
          <div className="bg-white font-semibold shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl">
            <img src="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">Java Backend</h3>
              <p className="text-sm text-gray-600 mt-2">
                Khoá học Java Springboot API cho người mới.
              </p>
              <p className="text-sm text-gray-600 mt-1">60 lessons</p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                Lecturer: <h1 className="text-fcolor"> Nguyen trung Tinh</h1>
              </p>
              <button className="mt-4 w-full bg-scolor text-black text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
                Enroll Now
              </button>
            </div>
          </div>
          <div className="bg-white font-semibold shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl">
            <img src="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">Java Backend</h3>
              <p className="text-sm text-gray-600 mt-2">
                Khoá học Java Springboot API cho người mới.
              </p>
              <p className="text-sm text-gray-600 mt-1">60 lessons</p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                Lecturer: <h1 className="text-fcolor"> Nguyen trung Tinh</h1>
              </p>
              <button className="mt-4 w-full bg-scolor text-black text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
