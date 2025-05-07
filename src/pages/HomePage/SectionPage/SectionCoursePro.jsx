import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import { PiArrowFatLinesDown } from "react-icons/pi";
import SkeletonSection from "../../../components/SkeletonLoading/SkeletonSection";

export default function SectionCoursePro() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState(4);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

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
    <div className="font-semibold h-full dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-sicolor border-1 text-gray-600 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      <img
        src={course.img || "/default-course-img.jpg"}
        alt={course.courseName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 font-bold">
        <h3 className="text-2xl h-16 w-full font-bold text-gray-800 dark:text-darkText overflow-hidden text-ellipsis line-clamp-2 leading-tight h-[4.rem]">
          {course.courseName || (language === "vi" ? "Khoá học Java" : "Java Course")}
        </h3>
        <p className="text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug h-[2.5rem]">
          {course.description ||
            (language === "vi"
              ? "Khoá học Java Spring Boot cho người mới bắt đầu."
              : "Java Spring Boot course for beginners.")}
        </p>

        <p className="text-sm mt-1">
          {language === "vi" ? "Số bài học: " : "Lessons: "}
          {Array.isArray(course?.lessons) ? course.lessons.length : 60}
        </p>
        <p className="text-sm mt-1">
          {language === "vi" ? "Giảng viên: " : "Lecturer: "}
          <span className="text-fcolor">
            {course.user?.username || "Nguyen Trung Tinh"}
          </span>
        </p>

        <a href={`/view-course/${course.id}`}>
          <button className="mt-4 w-full bg-scolor text-white text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300">
            {language === "vi" ? "Xem khoá học" : "View Course"}
          </button>
        </a>
      </div>
    </div>
  );

  const handleShowMore = () => {
    setVisibleCourses((prev) => prev + 4);
  };

  return (
    <div className="w-full mx-auto px-4 pt-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
        {language === "vi"
          ? "Nâng cao kỹ năng – Truy cập chuyên sâu"
          : "Advance Your Skills – Premium Access"}
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
          <div className="col-span-full text-center text-xl font-semibold text-gray-500">
            {language === "vi"
              ? "Không có khoá học trả phí nào."
              : "No premium courses available."}
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
            <p>
              {language === "vi"
                ? "Xem thêm khoá học"
                : "Show more courses"}
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
