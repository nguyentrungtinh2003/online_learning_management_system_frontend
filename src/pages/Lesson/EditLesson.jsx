import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaBuffer } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { getLessonById, updateLesson } from "../../services/lessonapi";

const EditLesson = () => {
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  const { id } = useParams();

  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [videoURL, setVideoURL] = useState("");

  const [lessons, setLesson] = useState({
    lessonName: "",
    description: "",
    img: "",
    video: "",
  });

  const [initialLesson, setInitialLesson] = useState({
    lessonName: "",
    description: "",
    img: "",
    video: "",
  });

  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await getLessonById(id); // chỉ trả về response.data

        if (response && response.data) {
          const formattedLesson = {
            lessonName: response.data.lessonName || "",
            description: response.data.description || "",
            img: response.data.img || "",
            video: response.data.video || "",
          };

          setLesson(formattedLesson);
          setInitialLesson(formattedLesson);
        } else {
          setError("Không thể tải dữ liệu bài học");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu bài học:", err);
        setError("Không thể tải dữ liệu bài học");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lessons, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Lấy file ảnh đầu tiên người dùng chọn
    if (file) {
      setImg(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Sau khi đọc xong file, chúng ta gán kết quả vào state để hiển thị
        setImgPreview(reader.result);
      };

      // Đọc file ảnh dưới dạng URL data
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (value) => {
    setLesson((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleClosePreview = () => {
    setVideo(null);
    setVideoURL("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu đang submit, chặn
    if (isSubmitted) return;

    setIsSubmitted(true); // ✅ dùng biến mới

    const isDataUnchanged =
      lessons.lessonName === initialLesson.lessonName &&
      lessons.description === initialLesson.description &&
      lessons.video === initialLesson.video &&
      lessons.img === initialLesson.img &&
      !img;

    if (isDataUnchanged) {
      navigate(-1);
      return;
    }

    const missingFields = [];

    if (!lessons.lessonName.trim()) {
      missingFields.push(t("lessonName"));
    } else if (lessons.lessonName.length > 255) {
      toast.error(t("Tên bài học không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
    }

    if (!lessons.description.trim()) {
      missingFields.push(t("description"));
    } else if (lessons.description.length > 255) {
      toast.error(t("Mô tả không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
    }

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p>{t("Thiếu thông tin !")}</p>
          <ul className="list-disc list-inside">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>,
        { autoClose: 1000 }
      );
      setIsSubmitted(false); // ✅ reset
      return;
    }

    try {
      const result = await updateLesson(id, lessons, img, video);

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
      setIsSubmitted(false); // ✅ reset
    }
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaVideo size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addLesson.main")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("editLesson.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          {/* Tên bài học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("lesson.name")}:</label>
            <input
              type="text"
              name="lessonName"
              value={lessons.lessonName}
              onChange={handleChange}
              placeholder="Enter Lesson Name"
              required
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText"
            />
          </div>

          {/* Description */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("description")}</label>
            <ReactQuill
              theme="snow"
              value={lessons.description}
              onChange={handleDescriptionChange}
              placeholder={t("Enter Description")}
              className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg "
            />
          </div>

          {/* Image Upload */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("image")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          {/* Current Image */}
          {lessons.img && !imgPreview && (
            <div className="mt-4 items-center flex space-x-4">
              <h3 className="w-1/4 font-medium">{t("currentImage")}</h3>
              <img
                src={lessons.img}
                alt="Current Image"
                className="mt-2 max-w-[200px] h-auto border-2 dark:border-darkBorder border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* Image Preview */}
          {imgPreview && (
            <div className="mt-4 text-center">
              <h3 className="font-medium">{t("image")}</h3>
              <img
                src={imgPreview}
                alt="Preview"
                className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
              />
            </div>
          )}

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
            <button
              onClick={() => !loading && navigate(-1)}
              disabled={loading || isSubmitted}
              className={`px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer`}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitted}
              className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${
                loading || isSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-scolor text-wcolor hover:bg-opacity-80"
              }`}
              style={{ minWidth: "120px" }} // bạn có thể tăng hoặc giảm width tùy ý
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
              )}
              <span>
                {loading
                  ? t("processing")
                  : isSubmitted
                  ? t("submitted")
                  : t("submit")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;
