import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";

const AddQuestion = () => {
  const navigate = useNavigate();

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
        const res = await axios.get(`${URL}/courses/all`, { withCredentials: true });
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
        const res = await axios.get(`${URL}/teacher/lessons/courses/${questions.courseId}/all`, {
          withCredentials: true,
        });
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
        const res = await axios.get(`${URL}/teacher/quizzes/lessons/${questions.lessonId}/all`, {
          withCredentials: true,
        });
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

    if (!questions.quizId || !questions.correctAnswer || !questions.questionText) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("question", new Blob([JSON.stringify(questions)], { type: "application/json" }));
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
    <div className="flex w-full flex-col h-full">
      <div className="flex dark:text-darkText mb-2 items-center gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Question Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Add New Question</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-wcolor dark:text-darkText dark:border dark:border-darkBorder dark:bg-darkSubbackground shadow-2xl p-6 rounded-xl space-y-4"
      >
        <div className="flex items-center">
          <label className="w-1/4 font-medium">Course:</label>
          <select
            name="courseId"
            value={questions.courseId}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">Lesson:</label>
          <select
            name="lessonId"
            value={questions.lessonId}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
            disabled={!questions.courseId}
          >
            <option value="">-- Select Lesson --</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lessonName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">Quiz:</label>
          <select
            name="quizId"
            value={questions.quizId}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
            disabled={!questions.lessonId}
          >
            <option value="">-- Select Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.quizName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">Question Text:</label>
          <input
            type="text"
            name="questionText"
            value={questions.questionText}
            onChange={handleChange}
            className="flex-1 p-2 border-2 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 font-medium">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 p-2 border-2 rounded"
          />
          {imgPreview && (
            <img src={imgPreview} alt="preview" className="h-16 w-auto border rounded" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((letter) => (
            <div key={letter} className="flex items-center">
              <label className="w-1/4 font-medium">{`Answer ${letter}:`}</label>
              <input
                type="text"
                name={`answer${letter}`}
                value={questions[`answer${letter}`]}
                onChange={handleChange}
                className="flex-1 p-2 border-2 rounded"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <label className="w-1/4 font-medium">Correct Answer:</label>
          <select
            name="correctAnswer"
            value={questions.correctAnswer}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Correct Answer --</option>
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
            className="px-6 py-2 border dark:text-darkText border-gray-500 text-gray-600 rounded hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddQuestion;
