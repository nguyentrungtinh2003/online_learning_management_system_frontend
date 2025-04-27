import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";

import URL from "../../config/URLconfig";

const AddQuizz = () => {
  const navigate = useNavigate();

  const { lessonId } = useParams();
  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    price: "",
    img: "",
    date: "",
    quizEnum: "FREE",
    isDeleted: false,
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
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error("Không thể thêm quiz!", {
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
        <h2 className="text-lg font-bold">Quiz Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Add New Quiz</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="space-y-4">
          {[
            { label: "Quiz Name:", name: "quizName" },
            { label: "Price", name: "price", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">{label}</label>
              <input
                type={type || "text"}
                name={name}
                value={quizData[name]}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">
              Description:
            </label>
            <textarea
              name="description"
              rows={3}
              value={quizData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Type:</label>
            <select
              name="quizEnum"
              value={quizData.quizEnum}
              onChange={(e) =>
                setQuizData({ ...quizData, quizEnum: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-scolor text-wcolor hover:bg-opacity-80"
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

export default AddQuizz;
