import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";
import { useTranslation } from "react-i18next";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";

const UpdateQuestion = () => {
  const { t } = useTranslation("adminmanagement");
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [questionData, setQuestionData] = useState({
    questionName: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    answerCorrect: "",
    isDeleted: false,
    quizId: "",
  });

  useEffect(() => {
    axios
      .get(`${URL}/questions/${questionId}`)
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${URL}/questions/update/${questionId}`, questionData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Question updated successfully!");
        navigate("/questions");
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("updateQuestion.title")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("updateQuestion.edit")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuestion.title")}:
              </label>
              <input
                type="text"
                name="questionName"
                value={questionData.questionName}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              />
            </div>

            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt} className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">{`${t(
                  "updateQuestion.answer"
                )} ${opt}:`}</label>
                <input
                  type="text"
                  name={`answer${opt}`}
                  value={questionData[`answer${opt}`]}
                  onChange={handleChange}
                  className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
                />
              </div>
            ))}

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("updateQuestion.correctAnswer")}:
              </label>
              <select
                name="answerCorrect"
                value={questionData.answerCorrect}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              >
                <option value="">{t("updateQuestion.selectCorrect")}</option>
                {["A", "B", "C", "D"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Link
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("updateQuestion.cancel")}
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
              {loading
                ? t("updateQuestion.processing")
                : t("updateQuestion.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
