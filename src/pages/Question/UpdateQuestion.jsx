import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(null);
  const [initialQuestionData, setInitialQuestionData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [questionData, setQuestionData] = useState({
    questionName: "",
    img: "",
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
      .get(`${URL}/questions/${questionId}`, { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.data) {
          setQuestionData((prev) => ({
            ...prev,
            ...response.data.data,
          }));
          setInitialQuestionData(response.data.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitted) return;
    setIsSubmitted(true);

    // Kiểm tra các trường bắt buộc
    const missingFields = [];
    if (!questionData.questionName.trim())
      missingFields.push(t("updateQuestion.title"));
    if (!questionData.answerA.trim()) missingFields.push("Answer A");
    if (!questionData.answerB.trim()) missingFields.push("Answer B");
    if (!questionData.answerC.trim()) missingFields.push("Answer C");
    if (!questionData.answerD.trim()) missingFields.push("Answer D");
    if (!questionData.answerCorrect.trim())
      missingFields.push("Correct Answer");

    if (missingFields.length > 0) {
      alert("Missing required fields:\n" + missingFields.join("\n"));
      setIsSubmitted(false);
      return;
    }

    try {
      // Tạo FormData để gửi multipart/form-data
      const formData = new FormData();
      // Đưa questionData dưới dạng JSON string và đóng gói thành Blob mới gửi lên server
      formData.append(
        "question",
        new Blob([JSON.stringify(questionData)], { type: "application/json" })
      );

      // Nếu có ảnh mới, thêm vào formData
      if (img) {
        formData.append("img", img);
      }

      await axios.put(
        `${URL}/teacher/questions/update/${questionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Updated successfully!", {
        autoClose: 1000,
        position: "top-right",
      });

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question!");
    } finally {
      setIsSubmitted(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

            {/* Phần hiển thị ảnh hiện tại (nếu có) */}
            {questionData.img && !img && (
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("currentImage")}:
                </label>
                <img
                  src={questionData.img}
                  alt="Current question"
                  className="max-w-xs max-h-40 rounded"
                />
              </div>
            )}

            {/* Input để chọn ảnh mới */}
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                {t("image")}:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Link
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg ${
                isSubmitted
                  ? "bg-gray-400"
                  : "bg-scolor text-ficolor hover:bg-opacity-80"
              }`}
              disabled={isSubmitted}
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

export default UpdateQuestion;
