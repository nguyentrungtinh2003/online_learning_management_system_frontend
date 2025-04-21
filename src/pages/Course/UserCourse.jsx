import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { userEnroll } from "../../services/courseapi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await userEnroll(userId);
        setCourses(data.data); // data.data nếu API của bạn trả về { data: [...] }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };

    fetchCourses();
  }, [userId]);


    return (
    <div className="flex-1 py-3">
      <div className="bg-white shadow h-full overflow-y-auto px-4 space-y-4">
        <Navbar />

        <div className="space-y-4 mx-10">
          <p className="text-fcolor font-bold text-3xl">Following Courses</p>
          {loading ? (
            <p>Loading...</p>
          ) : courses.length === 0 ? (
            <p>No courses enrolled.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-fit border hover:shadow-2xl duration-700 rounded-2xl"
                >
                  <img
                    src={item.course.img}
                    alt={item.course.name}
                    className="h-32 w-full object-cover rounded-t-2xl"
                  />
                  <div className="px-3 py-2 text-xs font-semibold space-y-1">
                    <h1 className="text-2xl font-bold">{item.course.name}</h1>
                    <p>{item.course.description}</p>
                    <p className="flex gap-2">
                      Enrolled Date:{" "}
                      <span className="text-fcolor">{item.enrolledDate}</span>
                    </p>
                    <button
                      onClick={() => navigate(`/view-lesson/${item.course.id}`)}
                      className="w-full mt-2 bg-scolor hover:shadow-2xl rounded-lg text-xs p-2 font-bold"
                    >
                        Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

