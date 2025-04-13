import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import axios from "axios";
import { Link } from "react-router-dom";
import SkeletonLoading from "../../../components/SkeletonLoading/SkeletonLoading";
import { buyCourse } from "../../../services/courseapi";
import { ToastContainer, toast, Slide } from "react-toastify";

export default function SectionCoursePro() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/courses/all`)
      .then((response) => {
        const paidCourses = response.data.data.filter(
          (course) => course.price > 0
        );
        setCourses(paidCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const CourseCard = ({ course }) => (
    <div className="bg-white font-semibold shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl border">
      <img
        src={course.img || "https://via.placeholder.com/300"}
        alt={course.courseName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 font-bold">
        <h3 className="text-2xl font-bold text-gray-800">
          {course.courseName}
        </h3>
        <p className="text-sm text-gray-600 mt-2">Price: {course.price} USD</p>
        <p className="text-sm text-gray-600 mt-1">
          Coins: {course.coin || "N/A"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Students: {course.students || "N/A"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Lessons: {course.lessons?.length || "N/A"}
        </p>

        <button
          onClick={() => buyCourse(course.id)}
          className="mt-4 w-full bg-scolor text-black text-xl font-semibold py-2 rounded-lg hover:bg-fcolor transition duration-300"
        >
          Unlock Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <ToastContainer />
      <h2 className="text-4xl text-rose-600 font-bold text-center mb-8">
        Top-Tier Learning Experience
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <SkeletonLoading />
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full">
            <SkeletonLoading />
          </div>
        )}
      </div>
    </div>
  );
}
