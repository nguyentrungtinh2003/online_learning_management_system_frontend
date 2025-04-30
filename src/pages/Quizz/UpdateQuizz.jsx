import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";

import URL from "../../config/URLconfig";

const UpdateQuizz = () => {
  const { lessonId, quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    quizName: "",
    description: "",
    price: "",
    img: "",
    lessonId: lessonId,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/quizzes/${quizId}`, { withCredentials: true })
      .then(({ data }) => {
        console.log("Dữ liệu nhận từ API:", data);
        setQuiz({
          ...data.data,
          lesson: { id: data.data.lesson?.id ?? lessonId },
        });
      })
      .catch(() => setError("Không thể tải dữ liệu trắc nghiệm"))
      .finally(() => setLoading(false));
  }, [quizId]);

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
      const response = await axios.put(
        `${URL}/teacher/quizzes/update/${quizId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Cho phép gửi cookies, session
        }
      );
      console.log("Thành công:", response);
      // alert("Cập nhật khóa học thành công!");
      toast.success("Cập nhật trắc nghiệm thành công!", {
        position: "top-right",
        autoClose: 3000, // 4 giây
      });

      setTimeout(() => {
        navigate(-1);
      }, 4000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      // alert("Lỗi khi thêm khóa học!");
      toast.error("Không thể cập nhật trắc nghiệm!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col h-full py-4 px-3">
      <div className="flex items-center mb-2 gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Quiz Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Edit Quiz</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">
              Quiz Title:
            </label>
            <input
              type="text"
              name="quizName"
              value={quiz.quizName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Price:</label>
            <input
              type="number"
              name="price"
              value={quiz.price}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Image:</label>
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
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">
              Description:
            </label>
            <textarea
              name="description"
              rows={3}
              value={quiz.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Type:</label>
            <select
              name="quizEnum"
              value={quiz.quizEnum}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            >
              <option>Select Type</option>
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
                : "bg-scolor text-ficolor hover:bg-opacity-80"
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

export default UpdateQuizz;
