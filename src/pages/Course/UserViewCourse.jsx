import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import URL from "../../config/URLconfig";
import { getCourseById } from "../../services/courseapi";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UserViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoDurations, setVideoDurations] = useState({});
  const [showAllLessons, setShowAllLessons] = useState(false);

  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const requireLogin = () => {
    const userId = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (!userId || !role) {
      toast.warn("Bạn cần đăng nhập để thực hiện chức năng này!", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login"); // chuyển hướng sau 2 giây
      }, 2000);

      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("id course " + id);
        const response = await getCourseById(parseInt(id));
        if (response && response.statusCode === 200) {
          setCourse(response.data);
          setLessons(response.data.lessons || []);
        } else {
          throw new Error(response?.message || "Failed to load course data");
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (!lessons || lessons.length === 0) return;
    const loadDurations = async () => {
      const promises = lessons.map((lesson, i) => {
        if (!lesson.videoURL) return Promise.resolve({ index: i, duration: 0 });

        const video = document.createElement("video");
        video.src = lesson.videoURL;

        return new Promise((resolve) => {
          video.onloadedmetadata = () =>
            resolve({ index: i, duration: video.duration });
          video.onerror = () => resolve({ index: i, duration: 0 });
        });
      });

      const results = await Promise.all(promises);
      const durations = {};
      results.forEach(({ index, duration }) => {
        durations[index] = duration;
      });
      setVideoDurations(durations);
    };

    loadDurations();
  }, [lessons]);

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "Loading...";
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const buyCourse = async (id) => {
    if (!requireLogin()) return;
    setBuyLoading(true);
    const userId = localStorage.getItem("id");
    if (!userId) {
      console.error("User ID not found. Please log in.");
      setBuyLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${URL}/courses/buy/${userId}/${id}`);
      if (response) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBuyLoading(false);
    }
  };

  const toggleShowAllLessons = () => {
    setShowAllLessons(!showAllLessons);
  };

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <p>Course not found.</p>
      </div>
    );
  }

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const lessonsToDisplay = showAllLessons ? lessons : lessons.slice(0, 4);

  return (
    <div className="flex flex-col w-full h-full dark:bg-darkBackground dark:text-darkSubtext">
      <div className="flex flex-col h-full gap-2 lg:flex-row mx-auto w-full">
        {/* Left content */}
        <div className="flex-1 space-y-2 h-full overflow-y-auto">
          {/* Course Title */}
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext p-6 rounded-lg shadow space-y-4">
            <h1 className="text-4xl font-semibold text-gray-800 dark:text-darkText">
              {course.courseName}
            </h1>
            <p className="text-lg">
              {course.description
                ? stripHtml(course.description).slice(0, 80) +
                  (stripHtml(course.description).length > 80 ? "..." : "")
                : "No description"}
            </p>
          </div>
          {/* Instructor */}
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-darkText">
              Instructor
            </h2>
            <div className="flex items-center gap-4">
              {/* Instructor Image */}
              <img
                src={course.user.img || "/user.png"} // Replace with actual instructor image
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold dark:text-darkText">
                  {course.user.username}
                </p>
                <p className="text-sm text-gray-600 dark:text-darkSubtext">
                  Giảng viên có 2 năm kinh nghiệm trong lập trình FullStack
                </p>
                <p className="text-sm text-gray-500">Courses taught: 120+</p>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground p-6 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-semibold dark:text-darkText text-gray-800">
              Nội dung khoá học
            </h2>
            {lessonsToDisplay.map((lesson, index) => (
              <li
                key={lesson._id || index}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <Link
                    to={`/lesson/${lesson._id}`}
                    className="font-semibold hover:underline text-blue-600"
                  >
                    {lesson.lessonName}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {lesson.videoURL
                      ? formatDuration(videoDurations[index])
                      : "No video link"}
                  </p>
                </div>
              </li>
            ))}
            {lessons.length > 4 && !showAllLessons && (
              <button
                onClick={toggleShowAllLessons}
                className="text-blue-600 hover:underline mt-4"
              >
                See All
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full h-full lg:w-[350px] flex flex-col gap-6">
          {/* Course Details */}
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground h-full p-6 rounded-lg shadow space-y-6">
            {/* Course Image */}
            <div>
              <div className="relative w-auto h-32 mb-6">
                <img
                  src={course.img}
                  alt={course.courseName}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Thông tin khoá học
              </h2>
              <p>
                <strong>Giá:</strong>{" "}
                {course?.price > 0 ? `${course.price} coin` : "Miễn phí"}
              </p>
              <p>
                <strong>Số bài học:</strong> {lessons.length}
              </p>
              <p>
                <strong>Người dạy:</strong>
                {course.user.username}
              </p>
            </div>

            {/* Button Enroll Course */}
            {role !== "ADMIN" && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => buyCourse(id)}
                  className="bg-fcolor hover:bg-scolor text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {buyLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
