import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";

const AddQuestion = () => {
  const navigate = useNavigate();

  const { quizId } = useParams();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

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
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

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
      const response = await axios.post(`${URL}/teacher/questions/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Thêm câu hỏi thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 3000);
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
    <div className="flex flex-col h-fit py-6 px-3">
      <AdminNavbar />
      <div className="flex items-center gap-2 mb-4">
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
          {[
            { label: "Question Name", name: "questionName" },
            { label: "Answer A", name: "answerA" },
            { label: "Answer B", name: "answerB" },
            { label: "Answer C", name: "answerC" },
            { label: "Answer D", name: "answerD" },
            { label: "Correct Answer (A/B/C/D)", name: "answerCorrect" },
          ].map(({ label, name }) => (
            <div key={name} className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                {label}:
              </label>
              <input
                type="text"
                name={name}
                value={questionData[name]}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

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
        </div>

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
