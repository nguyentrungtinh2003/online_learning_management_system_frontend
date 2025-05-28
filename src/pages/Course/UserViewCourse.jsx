import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import URL from "../../config/URLconfig";
import { getCourseById } from "../../services/courseapi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserViewCourse() {
  const { t } = useTranslation("usercourse");
  const videoRef = useRef(null);
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
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
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
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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
    <div className="w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-lg">
      {/* Hero Section */}
      <section className="relative rounded-t-lg h-[80vh] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center px-10">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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
                  ? t('course.buyWithCoin', { price: course.price })
                  : t('course.joinFree')}
              </button>
              <button
                onClick={() =>
                  videoRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-white underline hover:text-yellow-300"
              >
                {t('course.watchPreview')}
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
      <section className="py-20 bg-wcolor dark:bg-darkSubbackground">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t('course.whatYouWillLearn')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                title: t('course.learn.skill'),
                desc: t('course.learn.desc1'),
                colors: "from-pink-500 to-red-500",
              },
              {
                title: t('course.learn.thinking'),
                desc: t('course.learn.desc2'),
                colors: "from-green-500 to-emerald-400",
              },
              {
                title: t('course.learn.logic'),
                desc: t('course.learn.desc3'),
                colors: "from-blue-500 to-sky-400",
              },
              {
                title: t('course.learn.confidence'),
                desc: t('course.learn.desc4'),
                colors: "from-yellow-500 to-orange-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 bg-gradient-to-r ${item.colors} rounded-xl text-white shadow-lg`}
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Preview */}
      <section ref={videoRef} className="bg-black py-10 relative">
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
                ? t('course.enrollNow', { price: course.price })
                : t('course.learnNowFree')}
            </button>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-10 bg-wcolor dark:bg-darkSubbackground">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            {t('course.content')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-10 space-y-6">
            {lessonsToDisplay.map((lesson, index) => (
              <div
                key={lesson._id || index}
                className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="relative px-4 py-2 w-full rounded-lg hover:bg-tcolor dark:hover:bg-darkHover">
                  <p className="text-lg font-semibold">
                    {lesson.lessonName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {lesson.videoURL
                      ? formatDuration(videoDurations[index])
                      : t('course.noVideo')}
                  </p>
                  <div className="flex absolute top-3 right-4 items-center space-x-2">
                    {lesson.videoURL ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full dark:bg-green-900 dark:text-green-300">
                        {t('course.hasVideo')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full dark:bg-red-900 dark:text-red-300">
                        {t('course.missingVideo')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {lessons.length > 4 && !showAllLessons && (
              <div className="text-center pt-4">
                <button
                  onClick={toggleShowAllLessons}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {t('course.seeAllLessons')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Instructor and Testimonial */}
      <section className="py-20 bg-gray-50 dark:bg-darkSubbackground">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
          <div className="text-center">
            <img
              src={course.user.img || "/user.png"}
              className="rounded-full w-40 h-40 object-cover mx-auto mb-4 border-4 border-indigo-300 dark:border-indigo-500 shadow-lg"
              alt="Instructor"
            />
            <h3 className="text-2xl font-bold">{course.user.username}</h3>
            <p className="text-gray-600 dark:text-darkText mt-2">
              {t('course.instructorTitle')}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">{t('course.testimonialTitle')}</h3>
            <blockquote className="bg-wcolor dark:bg-darkHover p-6 rounded-xl shadow">
              <p className="text-lg italic">
                {t('course.testimonial')}
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
          <h2 className="text-3xl font-bold mb-6">{t('course.readyTitle')}</h2>
          <p className="mb-8">
            {t('course.readyDesc')}
          </p>
          <button
            onClick={() => buyCourse(id)}
            className="bg-yellow-400 text-black px-8 py-3 font-bold rounded-xl hover:scale-105 transition"
          >
            {course.price > 0
              ? t('course.buyCourse', { price: course.price })
              : t('course.startFree')}
          </button>
        </div>
      </section>
    </div>
  );
}
