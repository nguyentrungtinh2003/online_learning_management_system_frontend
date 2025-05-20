import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";
import { useTranslation } from "react-i18next";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [questions, setQuestions] = useState({
    courseId: "",
    lessonId: "",
    quizId: "",
    questionText: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    correctAnswer: "",
  });

  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch course list
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${URL}/courses/all`, {
          withCredentials: true,
        });
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch lessons based on course
  useEffect(() => {
    if (!questions.courseId) {
      setLessons([]);
      setQuizzes([]);
      setQuestions((prev) => ({ ...prev, lessonId: "", quizId: "" }));
      return;
    }

    const fetchLessons = async () => {
      try {
        const res = await axios.get(
          `${URL}/teacher/lessons/courses/${questions.courseId}/all`,
          {
            withCredentials: true,
          }
        );
        setLessons(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [questions.courseId]);

  // Fetch quizzes based on lesson
  useEffect(() => {
    if (!questions.lessonId) {
      setQuizzes([]);
      setQuestions((prev) => ({ ...prev, quizId: "" }));
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${URL}/teacher/quizzes/lessons/${questions.lessonId}/all`,
          {
            withCredentials: true,
          }
        );
        setQuizzes(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };
    fetchQuizzes();
  }, [questions.lessonId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestions((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !questions.quizId ||
      !questions.correctAnswer ||
      !questions.questionText
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "question",
      new Blob([JSON.stringify(questions)], { type: "application/json" })
    );
    if (img) formData.append("img", img);

    setLoading(true);

    try {
      await axios.post(`${URL}/teacher/questions/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Question added successfully!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Unable to add question!", {
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
          <FaBuffer size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("addQuestion.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("addQuestion.addNew")}</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.course")}:
            </label>
            <select
              name="courseId"
              value={questions.courseId}
              onChange={handleChange}
              className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            >
              <option value="">{t("addQuestion.selectCourse")}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.lesson")}:
            </label>
            <select
              name="lessonId"
              value={questions.lessonId}
              onChange={handleChange}
              className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
              required
              disabled={!questions.courseId}
            >
              <option value="">{t("addQuestion.selectLesson")}</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.lessonName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.quiz")}:
            </label>
            <select
              name="quizId"
              value={questions.quizId}
              onChange={handleChange}
              className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
              required
              disabled={!questions.lessonId}
            >
              <option value="">{t("addQuestion.selectQuiz")}</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.quizName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.questionText")}:
            </label>
            <input
              type="text"
              name="questionText"
              value={questions.questionText}
              onChange={handleChange}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">
              {t("addQuestion.image")}:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
            />
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((letter) => (
              <div key={letter} className="flex items-center">
                <label className="w-1/4 font-medium">{`${t(
                  "addQuestion.answer"
                )} ${letter}:`}</label>
                <input
                  type="text"
                  name={`answer${letter}`}
                  value={questions[`answer${letter}`]}
                  onChange={handleChange}
                  className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.correctAnswer")}:
            </label>
            <select
              name="correctAnswer"
              value={questions.correctAnswer}
              onChange={handleChange}
              className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            >
              <option value="">{t("addQuestion.selectCorrectAnswer")}</option>
              {["A", "B", "C", "D"].map((ans) => (
                <option key={ans} value={ans}>
                  {ans}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Link
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("addQuestion.cancel")}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-scolor hover:bg-opacity-80"
              }`}
            >
              {loading ? t("addQuestion.processing") : t("addQuestion.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
