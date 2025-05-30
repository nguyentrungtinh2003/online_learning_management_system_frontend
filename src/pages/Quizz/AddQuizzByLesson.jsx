import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";

const AddQuizz = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { lessonId } = useParams();
  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    price: "0.0",
    img: "",
    date: "",
    quizEnum: "FREE",

    lessonId: lessonId,
  });

  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append(
      "quiz",
      new Blob([JSON.stringify(quizData)], { type: "application/json" })
    );
    if (img) data.append("img", img);

    try {
      const response = await axios.post(`${URL}/teacher/quizzes/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Cho phép gửi cookies, session
      });

      console.log("Thành công:", response.data);
      toast.success("Thêm quiz thành công!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error("Không thể thêm quiz!", {
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
          <FaBuffer size={isMobile ? 40 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("quizz.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addQuiz.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            {[
              { label: <p>{t("addQuiz.quizName")}</p>, name: "quizName" },
              { label: <p>{t("price")}</p>, name: "price", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">{label}</label>
                <input
                  type={type || "text"}
                  name={name}
                  value={quizData[name]}
                  onChange={handleChange}
                  className="flex-1 p-2 border-2 dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground rounded"
                />
              </div>
            ))}

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("image")}</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="flex-1 p-2 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("description")}</label>
              <textarea
                name="description"
                rows={3}
                value={quizData.description}
                placeholder={t("Enter Description")}
                onChange={handleChange}
                className="flex-1 p-2 border-2 dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground rounded"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("type")}</label>
              <select
                name="quizEnum"
                value={quizData.quizEnum}
                onChange={(e) =>
                  setQuizData({ ...quizData, quizEnum: e.target.value })
                }
                className="flex-1 p-2 border-2 dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground rounded"
              >
                <option value="FREE">{t("free")}</option>
                <option value="PAID">{t("paid")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => !loading && navigate(-1)}
              disabled={loading}
              className={`px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer`}
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
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                  {t("processing")}
                </div>
              ) : (
                <p>{t("submit")}</p>
              )}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizz;
