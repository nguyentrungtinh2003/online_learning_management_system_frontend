import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import { PiArrowFatLinesDown, PiMonitorPlayFill } from "react-icons/pi";
import SkeletonSection from "../../../components/SkeletonLoading/SkeletonSection";
import { useTranslation } from "react-i18next";
import { fetchFreeCourses } from "../../../services/courseapi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { isNewCourse } from "../../../services/courseapi";

export default function SectionCourseFree() {
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["freeCourses"],
    queryFn: fetchFreeCourses,
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState(4);
  const { t } = useTranslation("homepage");

  const handleShowMore = () => {
    setVisibleCourses((prev) => prev + 4);
  };

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
          {course.courseName || t("course.defaultTitle")}
        </h3>

        <p
          className="text-xl lg:text-sm mt-2 overflow-hidden text-ellipsis line-clamp-2 leading-snug lg:h-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: course.description || t("course.defaultDescription"),
          }}
        ></p>

        <p className="my-2">
          <span className="text-fcolor text-3xl lg:text-2xl font-semibold">
            {course.price === 0 || course.isFree
              ? t("course.free")
              : `${course.price.toLocaleString()}$`}
          </span>
        </p>

        <div className="flex items-center w-full justify-between">
          <p className="text-xl lg:text-sm mt-1 flex w-full gap-2 items-center">
            <img
              className="h-6 w-6 rounded-xl"
              alt={course.user?.username}
              src={course.user?.img}
            />
            <span>{course.user?.username}</span>
          </p>
          <p className="mt-1 text-xl lg:text-sm gap-2 flex items-center">
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

        <Link to={`/view-course/${course.id}`}>
          <button className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-lg font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300">
            {t("course.view")}
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="lg:text-3xl lg:py-0 py-4 text-4xl font-bold text-center dark:text-darkText mb-8">
        {t("course.heading")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading && courses.length === 0 ? (
          <div className="col-span-full">
            <SkeletonSection />
          </div>
        ) : isError ? (
          <div className="col-span-full text-center text-xl font-semibold text-red-500">
            {t("course.error")} - {error.message}
          </div>
        ) : courses.length > 0 ? (
          courses
            .slice(0, visibleCourses)
            .map((course) => <CourseCard key={course.id} course={course} />)
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
