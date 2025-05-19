import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import { PiArrowFatLinesDown, PiMonitorPlayFill } from "react-icons/pi";
import SkeletonSection from "../../../components/SkeletonLoading/SkeletonSection";
import { TbCoin } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function SectionCoursePro() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState(4);
  const { t } = useTranslation("homepage");

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
      return diffDays <= 30;
    };

    const fetchCoursesAndEnrollments = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          axios.get(`${URL}/courses/all`),
          axios.get(`${URL}/enroll/top-enrollments`)
        ]);

        const allCourses = courseRes?.data?.data || [];
        const topEnrollCourseIds =
          enrollRes?.data?.data?.map((ce) => ce.course?.id) || [];

        const paidCourses = allCourses
          .filter((course) => course.price > 0)
          .map((course) => ({
            ...course,
            isNew: isNewCourse(course.date),
            isPopular: topEnrollCourseIds.includes(course.id),
          }))
          .sort((a, b) => {
            const dateA = new Date(...(a.date || [0, 1, 1]));
            const dateB = new Date(...(b.date || [0, 1, 1]));
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

  const CourseCard = ({ course }) => (
    <div className="font-semibold h-full dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-sicolor border-1 text-gray-600 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      <div className="relative">
        <img
          src={course.img || "/default-course-img.jpg"}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        {course.isNew && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {t("course.new")}
          </span>
        )}
        {course.isPopular && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {t("course.popular")}
          </span>
        )}
      </div>

      <div className="p-6 font-bold">
        <h3 className="text-4xl lg:text-2xl h-16 font-bold text-gray-800 dark:text-darkText overflow-hidden text-ellipsis line-clamp-2 h-[5.5rem] lg:h-[3.9rem] leading-tight">
          {course.courseName || t("course.defaultCourseName")}
        </h3>

        <p className="text-xl lg:text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug lg:h-[2.5rem]">
          {course.description || t("course.defaultDescription")}
        </p>

        <p className="text-sm my-2">
          <span className="text-fcolor flex items-center gap-1 text-3xl lg:text-2xl font-semibold">
            <span className="line-through flex gap-1 justify-center items-center text-gray-400">
              {(course.price * 2).toLocaleString()}
              <TbCoin color="gold" size={25} />
            </span>
            <span>{course.price.toLocaleString()}</span>
            <TbCoin color="gold" size={25} />
          </span>
        </p>

        <div className="flex items-center w-full justify-between">
          <p className="text-xl lg:text-sm mt-1 flex w-full gap-2 items-center">
            <img className="h-6 w-6" alt={course.user?.username} src={course.user?.img} />
            <span>{course.user?.username}</span>
          </p>
          <p className="mt-1 gap-2 text-xl lg:text-sm flex items-center">
            <PiMonitorPlayFill size={25} />
            {Array.isArray(course?.lessons) ? course.lessons.length : 60}
          </p>
        </div>

        {course.duration && (
          <p className="text-sm mt-1">
            {t("course.duration")}: {course.duration}
          </p>
        )}

        {typeof course.rating === "number" && (
          <p className="text-sm mt-1">
            ⭐ {course.rating.toFixed(1)} / 5{" "}
            {course.reviews?.length > 0 &&
              `(${course.reviews.length} ${t("course.reviews")})`}
          </p>
        )}

        <a href={`/view-course/${course.id}`}>
          <button className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-xl font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300">
            {t("course.viewCourse")}
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
      <h2 className="lg:text-3xl lg:py-0 py-4 text-4xl font-bold text-center text-fcolor mb-8">
        {t("course.premiumTitle")}
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
            {t("course.noCourses")}
          </div>
        )}
      </div>

      {!loading && visibleCourses < courses.length && (
        <div className="w-full justify-center items-center mt-12 flex">
          <button
            onClick={handleShowMore}
            className="font-semibold text-gray-500 flex flex-col items-center hover:text-fcolor transition duration-300"
          >
            <PiArrowFatLinesDown size={25} />
            <p>{t("course.showMore")}</p>
          </button>
        </div>
      )}
    </div>
  );
}
