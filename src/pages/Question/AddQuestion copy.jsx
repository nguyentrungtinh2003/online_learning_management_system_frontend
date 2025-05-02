import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
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
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-2 dark:text-darkText">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Question Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Add New Question</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="space-y-4">
          {/* Câu hỏi */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">
              Question Name:
            </label>
            <input
              type="text"
              name="questionName"
              value={questionData.questionName}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Các đáp án A, B, C, D */}
          {["A", "B", "C", "D"].map((option) => (
            <div key={option} className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Answer {option}:
              </label>
              <input
                type="text"
                name={`answer${option}`}
                value={questionData[`answer${option}`]}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <span className="text-sm">Correct</span>
              </label>
            </div>
          ))}

          {/* Ảnh */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">
              Image (optional):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* Hiển thị đáp án đúng */}
          {questionData.answerCorrect && (
            <div className="mt-2 text-green-600 font-medium">
              Đáp án đúng: {questionData.answerCorrect}
            </div>
          )}
        </div>

        {/* Nút */}
        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
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
