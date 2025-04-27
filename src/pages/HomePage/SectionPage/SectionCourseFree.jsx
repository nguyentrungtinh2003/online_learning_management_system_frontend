import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import SkeletonSection from "../../../components/SkeletonLoading/SkeletonSection";
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
    <div className="font-semibold text-gray-600 dark:text-darkSubtext rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border-1 dark:border-darkBorder hover:shadow-2xl duration-300">
      <img
        src={course.img || "/default-course-img.jpg"}
        alt={course.courseName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 font-bold">
        <h3 className="text-2xl w-full font-bold dark:text-darkText text-gray-800 overflow-hidden text-ellipsis line-clamp-2 leading-tight h-[3.5rem]">
          {course.courseName || "Java Backend"}
        </h3>
        <p className="text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug h-[2.5rem]">
          {course.description || "Khoá học Java Springboot API cho người mới."}
        </p>
        <p className="text-sm mt-1">
          {Array.isArray(course?.lessons) ? course.lessons.length : 60} lessons
        </p>
        <p className="text-sm mt-1">
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
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full">
            <SkeletonSection />
          </div>
        )}
      </div>
    </div>
  );
}
