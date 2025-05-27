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
    toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    setBuyLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${URL}/courses/buy/${userId}/${id}`);
    const result = response.data;

    if (result.statusCode === 200) {
      toast.success("🎉 Mua khoá học thành công!");
    } else {
      if (result.message?.toLowerCase().includes("not enough")) {
        toast.error("❌ Số xu trong ví không đủ để mua khoá học.");
      } else {
        toast.error(`⚠️ ${result.message || "Không thể mua khoá học"}`);
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Đã xảy ra lỗi trong quá trình mua. Vui lòng thử lại sau.");
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
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              {course.courseName}
            </h1>
            <p className="text-lg opacity-80 mb-6">
              {stripHtml(course.description)}
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => buyCourse(id)}
                className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition"
              >
                {course.price > 0
                  ? `Tham gia với ${course.price} coin`
                  : "Tham gia miễn phí"}
              </button>
              <button className="text-white underline hover:text-yellow-300">
                Xem video giới thiệu
              </button>
            </div>
          </div>
          <div>
            <img
              src={course.img}
              className="rounded-3xl shadow-2xl object-cover h-[400px] w-full"
              alt="Course"
            />
          </div>
        </div>
      </section>

      {/* What You’ll Learn */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Bạn sẽ học được gì?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl text-white shadow-lg">
              <h4 className="text-xl font-semibold mb-2">
                🎯 Kỹ năng thực chiến
              </h4>
              <p className="text-sm opacity-90">
                Làm dự án thật, không chỉ lý thuyết
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl text-white shadow-lg">
              <h4 className="text-xl font-semibold mb-2">
                💡 Tư duy giải quyết vấn đề
              </h4>
              <p className="text-sm opacity-90">
                Học cách phân tích, gỡ bug, tối ưu
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl text-white shadow-lg">
              <h4 className="text-xl font-semibold mb-2">🧠 Logic lập trình</h4>
              <p className="text-sm opacity-90">
                Hiểu rõ thuật toán và cấu trúc dữ liệu
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-xl text-white shadow-lg">
              <h4 className="text-xl font-semibold mb-2">
                🚀 Tự tin phỏng vấn
              </h4>
              <p className="text-sm opacity-90">
                Sẵn sàng cho mọi vòng tuyển dụng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview */}
      <section className="bg-black py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <video
            className="rounded-xl w-full shadow-lg"
            controls
            src={course.previewURL}
          />
          <div className="mt-6 text-center">
            <button
              onClick={() => buyCourse(id)}
              className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-105 transition"
            >
              {course.price > 0
                ? `Đăng ký ngay - ${course.price} coin`
                : "Học ngay miễn phí"}
            </button>
          </div>
        </div>
      </section>

      {/* Instructor and Testimonial */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
          <div className="text-center">
            <img
              src={course.user.img || "/user.png"}
              className="rounded-full w-40 h-40 object-cover mx-auto mb-4"
              alt="Instructor"
            />
            <h3 className="text-2xl font-bold">{course.user.username}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Fullstack Developer, Mentor @ Code Arena
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Học viên nói gì?</h3>
            <blockquote className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
              <p className="text-lg italic">
                "Khóa học cực kỳ thực tế và dễ hiểu. Mình đã xin được job ngay
                sau khi học xong!"
              </p>
              <footer className="mt-4 text-sm text-gray-500">
                – Nguyễn Văn A, fresher React
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng để bắt đầu?</h2>
          <p className="mb-8">
            Tham gia ngay và bắt đầu hành trình lập trình chuyên nghiệp của bạn.
          </p>
          <button
            onClick={() => buyCourse(id)}
            className="bg-yellow-400 text-black px-8 py-3 font-bold rounded-xl hover:scale-105 transition"
          >
            {course.price > 0
              ? `Mua khóa học - ${course.price} coin`
              : "Bắt đầu miễn phí"}
          </button>
        </div>
      </section>
    </div>
  );
}
