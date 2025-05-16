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

  const isNewCourse = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return false;

  const courseDate = new Date(
    dateArray[0],         // year
    dateArray[1] - 1,     // month (0-based)
    dateArray[2],         // day
    dateArray[3] || 0,    // hour
    dateArray[4] || 0,    // minute
    dateArray[5] || 0     // second
  );

  const now = new Date();
  const diffTime = now - courseDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
  const isNewCourse = (dateArr) => {
    if (!dateArr) return false;
    const courseDate = new Date(
      dateArr[0],
      (dateArr[1] || 1) - 1,
      dateArr[2] || 1,
      dateArr[3] || 0,
      dateArr[4] || 0,
      dateArr[5] || 0
    );
    const now = new Date();
    const diffDays = (now - courseDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 30; // Khóa học mới trong 30 ngày
  };

  const fetchCoursesAndEnrollments = async () => {
    try {
      const [courseRes, enrollRes] = await Promise.all([
        axios.get(`${URL}/courses/all`),
        axios.get(`${URL}/enroll/top-enrollments`)
      ]);

      const allCourses = courseRes?.data?.data || [];
      const topEnrollCourseIds = enrollRes?.data?.data?.map(
        (ce) => ce.course?.id
      ) || [];

      const paidCourses = allCourses
        .filter((course) => course.price > 0)
        .map((course) => ({
          ...course,
          isNew: isNewCourse(course.date),
          isPopular: topEnrollCourseIds.includes(course.id),
        }))
        .sort((a, b) => {
          const dateA = a.date
            ? new Date(
                a.date[0],
                (a.date[1] || 1) - 1,
                a.date[2] || 1,
                a.date[3] || 0,
                a.date[4] || 0,
                a.date[5] || 0
              )
            : new Date(0);
          const dateB = b.date
            ? new Date(
                b.date[0],
                (b.date[1] || 1) - 1,
                b.date[2] || 1,
                b.date[3] || 0,
                b.date[4] || 0,
                b.date[5] || 0
              )
            : new Date(0);
          return dateB - dateA;
        });

      setCourses(paidCourses);
    } catch (error) {
      console.error("Error fetching courses or enrollments:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCoursesAndEnrollments();
}, []);



  const CourseCard = ({ course, language = "vi" }) => (
    <div className="font-semibold h-full dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-sicolor border-1 text-gray-600 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      <div className="relative">
        <img
          src={course.img || "/default-course-img.jpg"}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        {course.isNew && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {language === "vi" ? "Mới" : "New"}
          </span>
        )}
        {course.isPopular && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {language === "vi" ? "Bán chạy" : "Popular"}
          </span>
        )}
      </div>

      <div className="p-6 font-bold">
        <h3 className="text-2xl h-16 font-bold text-gray-800 dark:text-darkText overflow-hidden text-ellipsis line-clamp-2 leading-tight">
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
            {course.user?.username}
          </span>
        </p>

        {course.duration && (
          <p className="text-sm mt-1">
            {language === "vi" ? "Thời lượng: " : "Duration: "} {course.duration}
          </p>
        )}

        {typeof course.rating === "number" && (
          <p className="text-sm mt-1">
            ⭐ {course.rating.toFixed(1)} / 5{" "}
            {course.reviews?.length > 0 &&
              `(${course.reviews.length} ${
                language === "vi" ? "đánh giá" : "reviews"
              })`}
          </p>
        )}

        <p className="text-sm mt-1">
          {language === "vi" ? "Giá: " : "Price: "}
          <span className="text-green-600 font-semibold">
            {course.price === 0 || course.isFree
              ? language === "vi"
                ? "Miễn phí"
                : "Free"
              : `${course.price.toLocaleString()}₫`}
          </span>
        </p>

        <a href={`/view-course/${course.id}`}>
          <button className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-xl font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300">
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
      <h2 className="lg:text-3xl lg:py-0 py-4 text-4xl  font-bold text-center text-fcolor mb-8">
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
            <CourseCard key={course.id} course={course} language={language} />
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
