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

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 60 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("updateQuiz.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("updateQuiz.edit")}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
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
              <label className="w-1/4 text-gray-700 font-medium">
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
              <label className="w-1/4 text-gray-700 font-medium">
                {t("updateQuiz.image")}:
              </label>
              <div className="flex-1">
                {quiz.img && (
                  <img
                    src={quiz.img}
                    alt="Quiz"
                    className="w-40 h-40 object-cover rounded-md mb-2"
                  />
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="flex-1 p-2 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                {t("updateQuiz.description")}:
              </label>
              <textarea
                name="description"
                rows={3}
                value={quiz.description}
                onChange={handleChange}
                className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
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

          <div className="flex justify-end space-x-2 mt-6">
            <Link
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 dark:text-darkText text-gray-600 rounded hover:bg-tcolor dark:hover:bg-darkHover dark:border-darkBorder"
            >
              {t("updateQuiz.cancel")}
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
              {loading ? t("updateQuiz.processing") : t("updateQuiz.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuizz;
