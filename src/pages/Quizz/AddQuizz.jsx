import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const AddQuizz = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    price: "",
    img: "",
    date: "",
    quizEnum: "",
    isDeleted: false,
    lessonId: "",
  });

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null); // Trạng thái lưu ID bài học
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${URL}/courses/all`, { withCredentials: true });
        console.log(res.data);
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      return;
    }
  
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`${URL}/teacher/lessons/courses/${selectedCourseId}/all`, {
          withCredentials: true,
        });
  
        if (res.data?.data) {
          setLessons(res.data.data);
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessons([]);
      }
    };
  
    fetchLessons();
  }, [selectedCourseId]);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "courseId") {
      setSelectedCourseId(value);
      setQuizData((prev) => ({ ...prev, lessonId: "", courseId: value }));
    } else if (name === "quizEnum") {
      setQuizData((prev) => ({
        ...prev,
        quizEnum: value,
        price: value === "FREE" ? "0" : prev.price === "0" ? "1" : prev.price,
      }));
    } else if (name === "lessonId") {
      setQuizData((prev) => ({ ...prev, lessonId: value }));
    } else if (name === "price") {
      let sanitized = value.replace(/^0+(?=\d)/, "");
      if (quizData.quizEnum === "FREE") sanitized = "0";
      else if (parseInt(sanitized) < 1 || isNaN(parseInt(sanitized))) sanitized = "1";
  
      setQuizData((prev) => ({ ...prev, price: sanitized }));
    } else {
      setQuizData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra xem lessonId có được chọn chưa
    if (!quizData.lessonId) {
      toast.error(<p>{t("addQuiz.toastNoLesson")}</p>);
      return;
    }

    console.log("quizData.lessonId:", quizData.lessonId);

    setLoading(true);
  
    // Kiểm tra và đảm bảo lessonId được set đúng
    const updatedQuizData = {...quizData};

    // In ra đối tượng updatedQuizData để kiểm tra giá trị của lessonId
    console.log("Updated Quiz Data:", updatedQuizData);
  
    const formData = new FormData();
    formData.append("quiz", new Blob([JSON.stringify(updatedQuizData)], { type: "application/json" }));
    if (img) formData.append("img", img);
  
    try {
      await axios.post(`${URL}/teacher/quizzes/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      toast.success(<p>{t("addQuiz.toastSuccess")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
  
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(<p>{t("addQuiz.toastError")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleDescriptionChange = (value) => {
    setQuizData((prev) => ({
      ...prev,
      description: value,
    }));
  };
  

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex dark:text-darkText mb-2 items-center gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">{t("quizz.title")}</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">{t("addQuiz.title")}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-wcolor dark:text-darkText dark:border dark:border-darkBorder dark:bg-darkSubbackground shadow-2xl p-6 rounded-xl space-y-4">
        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("addQuiz.course")}</label>
          <select
            name="courseId"
            value={quizData.courseId}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            required
          >
            <option value="">{t("addQuiz.selectCourse")}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>

        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("addQuiz.lesson")}</label>
          <select
            name="lessonId"
            value={quizData.lessonId}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            required
            disabled={!selectedCourseId}
          >
            <option value="">{t("addQuiz.selectLesson")}</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lessonName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("addQuiz.quizName")}</label>
          <input
            type="text"
            name="quizName"
            value={quizData.quizName}
            onChange={handleChange}
            className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("price")}</label>
          <input
            type="number"
            name="price"
            value={quizData.price}
            onChange={handleChange}
            disabled={quizData.quizEnum === "FREE"}
            className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("image")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 p-2 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("description")}</label>
          <ReactQuill
            theme="snow"
            value={quizData.description}
            onChange={handleChange}
            rows={3}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">{t("type")}</label>
          <select
            name="quizEnum"
            value={quizData.quizEnum}
            onChange={handleChange}
            className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
          >
            <option value="FREE">{t("free")}</option>
            <option value="PAID">{t("paid")}</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border dark:text-darkText border-gray-500 text-gray-600 rounded hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? <p>{t("processing")}</p> : <p>{t("submit")}</p>}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddQuizz;
