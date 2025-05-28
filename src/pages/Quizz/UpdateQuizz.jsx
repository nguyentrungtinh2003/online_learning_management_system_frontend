import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import URL from "../../config/URLconfig";

const UpdateQuizz = () => {
  const { t } = useTranslation("adminmanagement");
  const { lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [quiz, setQuiz] = useState({
    quizName: "",
    description: "",
    price: "",
    img: "",
    lessonId: lessonId,
    quizEnum: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/quizzes/${quizId}`, { withCredentials: true })
      .then(({ data }) => {
        setQuiz({
          ...data.data,
          lesson: { id: data.data.lesson?.id ?? lessonId },
        });
      })
      .catch(() => setError(t("updateQuiz.loadError")))
      .finally(() => setLoading(false));
  }, [quizId, lessonId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "quiz",
      new Blob([JSON.stringify(quiz)], { type: "application/json" })
    );
    if (file) formData.append("img", file);

    try {
      await axios.put(`${URL}/teacher/quizzes/update/${quizId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success(t("updateQuiz.success"), {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate(-1);
      }, 4000);
    } catch (error) {
      toast.error(t("updateQuiz.error"), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("updateQuiz.title")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("updateQuiz.edit")}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuiz.quizName")}:
              </label>
              <input
                type="text"
                name="quizName"
                value={quiz.quizName}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuiz.price")}:
              </label>
              <input
                type="number"
                name="price"
                value={quiz.price}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuiz.image")}:
              </label>
              <div className="flex-1 gap-2 flex flex-col">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="flex-1 p-2 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
                />
                {quiz.img && (
                  <img
                    src={quiz.img}
                    alt="Quiz"
                    className="mt-2 max-w-[200px] h-auto border-2 dark:border-darkBorder border-gray-300 rounded-lg"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuiz.description")}:
              </label>
              <textarea
                name="description"
                rows={3}
                value={quiz.description}
                onChange={handleChange}
                className="flex-1 px-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuiz.type")}:
              </label>
              <select
                name="quizEnum"
                value={quiz.quizEnum}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              >
                <option>{t("updateQuiz.selectType")}</option>
                <option value="FREE">{t("updateQuiz.free")}</option>
                <option value="PAID">{t("updateQuiz.paid")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Link
              onClick={() => navigate(-1)}
              disabled={isSubmitted}
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              disabled={isSubmitted}
              className={`px-6 py-2 rounded-lg ${
                isSubmitted
                  ? "bg-gray-400 text-white"
                  : "bg-scolor text-ficolor hover:bg-opacity-80"
              }`}
            >
              {isSubmitted ? (
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

export default UpdateQuizz;
