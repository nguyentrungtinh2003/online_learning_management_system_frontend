import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const AddLesson = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    lessonName: "",
    description: "",
    date: "",
    courseId: "", // gán sau khi chọn
    isDeleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://codearena-backend-dev.onrender.com/api/courses/all", {
          withCredentials: true,
        });
        setCourses(res.data?.data || []);
        console.log("Courses API response:", res.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách khoá học:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setLessonData({ ...lessonData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDescriptionChange = (value) => {
    setCourseData((prev) => ({
      ...prev,
      description: value,
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "lesson",
      new Blob([JSON.stringify(lessonData)], { type: "application/json" })
    );
    if (img) formData.append("img", img);
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(
        "https://codearena-backend-dev.onrender.com/api/teacher/lessons/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(<p>{t("addLesson.success")}</p> , {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error(<p>{t("addLesson.error")}</p> , {
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
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("addLesson.main")}</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("addLesson.add")}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder dark:text-darkText p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* Chọn khoá học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("addLesson.selectCourse")}</label>
            <select
              name="courseId"
              value={lessonData.courseId}
              onChange={handleChange}
              className="flex-1 px-4 border-2 dark:border-darkBorder dark:bg-darkSubbackground py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            >
              <option value="">{t("addLesson.selectCoursePlaceholder")}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Các trường nhập bài học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("addLesson.lessonTitle")}</label>
            <input
              type="text"
              name="lessonName"
              value={lessonData.lessonName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("image")}</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="flex-1 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("video")}</label>
            <input
              type="file"
              onChange={handleVideoChange}
              className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("description")}</label>
            <ReactQuill
              theme="snow"
              value={lessonData.description}
              onChange={handleDescriptionChange}
              className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor dark:text-darkText text-ficolor rounded-lg hover:bg-opacity-80"
          >
           {t("cancel")}
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-scolor text-ficolor hover:bg-opacity-80"
            }`}
            disabled={loading}
          >
            {loading ? <p>{t("processing")}</p> :<p>{t("submit")}</p> }
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddLesson;
