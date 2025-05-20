import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import { FaVideo} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const EditLesson = () => {
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams(); // Lấy cả courseId từ URL

  const [lessons, setLesson] = useState({
    lessonName: "",
    description: "",
    date: "",
    courseId: courseId, // ID của khóa học
    isDeleted: false,
    img: "",
    videoURL: "",
  });

  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://codearena-backend-dev.onrender.com/api/lessons/${lessonId}`)
      .then(({ data }) => {
        setLesson({
          lessonName: data.data.lessonName || "",
          description: data.data.description || "",
          date: data.data.date || "",
          img: data.data.img || "", // Handle image URL
          videoURL: data.data.videoURL || "", // Handle video URL
          courseId: data.data.course?.id || courseId,
          isDeleted: data.data.isDeleted || false,
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu bài học:", err);
        setError("Không thể tải dữ liệu bài học");
      })
      .finally(() => setLoading(false));
  }, [lessonId, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lessons, [name]: value });
  };

  const handleImageChange = (e) => setFile(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "lesson",
      new Blob([JSON.stringify(lessons)], { type: "application/json" })
    );
    if (file) formData.append("img", file);
    if (video) formData.append("video", video);

    try {
      const response = await axios.put(
        `https://codearena-backend-dev.onrender.com/api/teacher/lessons/update/${lessonId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Cập nhật bài học thành công!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error(
        "Lỗi khi cập nhật bài học:",
        err.response?.data || err.message
      );
      toast.error("Không thể cập nhật bài học!", {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaVideo size={isMobile ? 60 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("addLesson.main")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("editLesson.title")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-2 text-gray-700 dark:text-darkText">
          {/* Tên bài học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("lesson.name")}:</label>
            <input
              type="text"
              name="lessonName"
              value={lessons.lessonName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText"
            />
          </div>

          {/* Mô tả */}
          <div className="flex items-start space-x-4">
            <label className="w-1/4 font-medium pt-2">{t("description")}:</label>
            <textarea
              name="description"
              rows={3}
              value={lessons.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText"
            ></textarea>
          </div>

          {/* Ảnh bài học */}
          <div className="flex items-start space-x-4">
            <label className="w-1/4 font-medium pt-2">{t("image")}:</label>
            <div className="flex-1 space-y-2">
              {lessons.img && (
                <img
                  src={lessons.img}
                  alt="Lesson"
                  className="w-40 h-40 object-cover rounded-md"
                />
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
              />
            </div>
          </div>

          {/* Video bài học */}
          <div className="flex items-start space-x-4">
            <label className="w-1/4 font-medium pt-2">{t("video")}:</label>
            <div className="flex-1 space-y-2">
              {lessons.videoURL && (
                <video controls className="w-64 h-40 rounded-md">
                  <source src={lessons.videoURL} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              )}
              <input
                type="file"
                onChange={handleVideoChange}
                className="w-full border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
              />
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="flex justify-end space-x-2 pt-4">
            <Link
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80 dark:text-darkText"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                loading
                  ? "bg-gray-400 text-white"
                  : "bg-scolor text-ficolor hover:bg-opacity-80"
              }`}
            >
              {loading ? t("processing") : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;
