import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import { PiArrowFatLinesDown } from "react-icons/pi";
import SkeletonSection from "../../../components/SkeletonLoading/SkeletonSection";

export default function SectionCoursePro() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState(4);

  useEffect(() => {
    axios
      .get(`${URL}/courses/all`)
      .then((response) => {
        const paidCourses = response?.data?.data?.filter(
          (course) => course.price > 0
        );
        setCourses(paidCourses || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const CourseCard = ({ course }) => (
    <div className="bg-white font-semibold rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border hover:shadow-2xl duration-300">
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
        <a href={`/view-course/${course.id}`}>
          <button className="mt-4 w-full bg-scolor text-white text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
            View Course
          </button>
        </a>
      </div>
    </div>
  );

  const handleShowMore = () => {
    setVisibleCourses((prev) => prev + 4);
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
        Top Courses – No Payment Needed!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full">
            <SkeletonSection />
          </div>
        ) : courses.length > 0 ? (
          courses.slice(0, visibleCourses).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full">
            <SkeletonSection />
          </div>
        )}
      </div>

      {/* Nút xem thêm */}
      {!loading && visibleCourses < courses.length && (
        <div className="w-full justify-center items-center mt-12 flex">
          <button
            onClick={handleShowMore}
            className="font-semibold text-gray-500 flex flex-col items-center hover:text-fcolor transition duration-300"
          >
            <PiArrowFatLinesDown size={25} />
            <p>Xem thêm khoá học</p>
          </button>
        </div>
      )}
    </div>
  );
}
