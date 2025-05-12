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
    <div className="w-full flex flex-col h-full">
      <div className="flex gap-2 dark:text-darkText">
        <FaVideo size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("addLesson.main")}</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("editLesson.title")}</h2>
      </div>

      <Form onSubmit={handleSubmit} className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText p-6 rounded-lg shadow">
        <Form.Group className="mb-3" controlId="formLessonName">
          <Form.Label>{t("lesson.name")}</Form.Label>
          <Form.Control
            type="text"
            name="lessonName"
            value={lessons.lessonName}
            onChange={handleChange}
            className="dark:bg-darkSubbackground dark:border-darkBorder dark:text-darkText"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>{t("description")}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={lessons.description}
            onChange={handleChange}
            className="dark:bg-darkSubbackground dark:border-darkBorder dark:text-darkText"
          />
        </Form.Group>

        {/* Hiển thị ảnh cũ nếu có */}
        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label>{t("image")}</Form.Label>
          {lessons.img && (
            <img
              src={lessons.img}
              alt="Lesson"
              className="w-40 h-40 object-cover rounded-md mb-2"
            />
          )}
          <Form.Control className="file:dark:bg-darkBackground file:dark:text-darkText dark:bg-darkSubbackground dark:border-darkBorder dark:text-darkText" type="file" onChange={handleImageChange} />
        </Form.Group>

        {/* Hiển thị video cũ nếu có */}
        <Form.Group className="mb-3" controlId="formVideo">
          <Form.Label>{t("video")}</Form.Label>
          {lessons.videoURL && (
            <video controls className="w-64 h-40 mb-2">
              <source src={lessons.videoURL} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          )}
          <Form.Control className="file:dark:bg-darkBackground file:dark:text-darkText dark:bg-darkSubbackground dark:border-darkBorder dark:text-darkText" type="file" onChange={handleVideoChange} />
        </Form.Group>

        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 dark:text-darkText py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-scolor text-ficolor hover:bg-opacity-80"
            }`}
            disabled={loading}
          >
            {loading ? <p>{t("processing")}</p> : <p>{t("submit")}</p> }
          </button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default EditLesson;
