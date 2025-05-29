import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const { quizId } = useParams();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(""); // "A", "B", "C", "D"

  const [questionData, setQuestionData] = useState({
    questionName: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    answerCorrect: "",
    isDeleted: false,
    quizId: quizId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  useEffect(() => {
    // Cập nhật answerCorrect mỗi khi selectedAnswer thay đổi
    if (selectedAnswer) {
      const correctText = questionData[`answer${selectedAnswer}`];
      setQuestionData((prev) => ({
        ...prev,
        answerCorrect: correctText,
      }));
    }
  }, [
    selectedAnswer,
    questionData.answerA,
    questionData.answerB,
    questionData.answerC,
    questionData.answerD,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append(
      "question",
      new Blob([JSON.stringify(questionData)], { type: "application/json" })
    );
    if (img) data.append("img", img);

    try {
      await axios.post(`${URL}/teacher/questions/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Thêm câu hỏi thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate(-1), 3000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error("Không thể thêm câu hỏi!", {
        position: "top-right",
        autoClose: 3000,
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
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addQuestion.title")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addQuestion.addNew")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.questionText")}:
            </label>
            <input
              type="text"
              name="questionName"
              value={questionData.questionName}
              onChange={handleChange}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">
              {t("addQuestion.image")}:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
            />
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {["A", "B", "C", "D"].map((letter) => (
              <div key={letter} className="flex items-center">
                <label className="w-1/4 font-medium">{`${t(
                  "addQuestion.answer"
                )} ${letter}:`}</label>
                <input
                  type="text"
                  name={`answer${letter}`}
                  value={questionData[`answer${letter}`]}
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
              name="answerCorrect"
              value={questionData.correctAnswer}
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
              className={`px-6 py-2 rounded-lg ${
                loading
                  ? "bg-gray-400"
                  : "bg-scolor text-ficolor hover:bg-opacity-80"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                  {t("processing")}
                </div>
              ) : (
                t("submit")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
