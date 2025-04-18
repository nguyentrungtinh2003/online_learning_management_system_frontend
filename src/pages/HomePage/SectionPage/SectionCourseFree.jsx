import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import SkeletonLoading from "../../../components/SkeletonLoading/SkeletonLoading";

export default function SectionCourseFree() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/courses/all`)
      .then((response) => {
        const allCourses = response?.data?.data || [];
        const freeCourses = allCourses.filter((course) => course.price === 0);
        setCourses(freeCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const buyCourse = (courseId) => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      alert("Bạn cần đăng nhập để mua khóa học!");
      return;
    }

    axios
      .post(`${URL}/courses/buy/${userId}/${courseId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error " + error.message);
      });
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white font-semibold rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border hover:shadow-2xl duration-700">
      <img
        src={course.img || "/default-course-img.jpg"}
        alt={course.courseName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 font-bold">
        <h3 className="text-2xl font-bold text-gray-800">
          {course.courseName || "Java Backend"}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {course.description || "Khoá học Java Springboot API cho người mới."}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {Array.isArray(course?.lessons) ? course.lessons.length : 60} lessons
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Lecturer:{" "}
          <span className="text-fcolor">
            {course.user?.username || "Nguyen Trung Tinh"}
          </span>
        </p>

        <button
          onClick={() => buyCourse(course.id)}
          className="w-full mt-4 py-2 bg-scolor text-xl text-black font-semibold rounded-lg hover:bg-fcolor hover:text-white transition-all duration-1000"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
        Top Courses – No Payment Needed!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full">
            <SkeletonLoading />
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No free courses available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
