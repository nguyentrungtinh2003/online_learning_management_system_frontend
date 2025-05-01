import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";

const AddQuizz = () => {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    price: "0",
    img: "",
    date: "",
    quizEnum: "FREE",
    isDeleted: false,
    lessonId: "",
    courseId:""
  });

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${URL}/courses/all`, {
          withCredentials: true,
        });
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy khoá học:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);  // Nếu không chọn khóa học, xóa danh sách bài học
      return;
    }
  
    const fetchLessons = async () => {
      try {
        // Gọi API để lấy bài học theo khóa học đã chọn và phân trang
        const res = await axios.get(`${URL}/teacher/lessons/courses/${selectedCourseId}/page`, {
          params: {
            page: 0,  // Chỉnh sửa page và size nếu cần
            size: 10
          },
          withCredentials: true,
        });
  
        // Kiểm tra dữ liệu trả về và cập nhật state
        if (res.data) {
          setLessons(res.data);  // Cập nhật danh sách bài học
        } else {
          setLessons([]);  // Nếu không có bài học, xóa danh sách
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài học:", error);
        setLessons([]);  // Nếu có lỗi, xóa danh sách bài học
      }
    };
    
    fetchLessons();
  }, [selectedCourseId]);  // Chạy lại khi selectedCourseId thay đổi
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quizEnum") {
      setQuizData((prev) => ({
        ...prev,
        quizEnum: value,
        price: value === "FREE" ? "0" : prev.price === "0" ? "1" : prev.price,
      }));
    } else if (name === "price") {
      let sanitized = value.replace(/^0+(?=\d)/, ""); // Remove leading zeros
      if (quizData.quizEnum === "FREE") sanitized = "0";
      else if (parseInt(sanitized) < 1 || isNaN(parseInt(sanitized))) sanitized = "1";

      setQuizData((prev) => ({ ...prev, price: sanitized }));
    } else {
      setQuizData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizData.lessonId) {
      toast.error("Vui lòng chọn bài học!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("quiz", new Blob([JSON.stringify(quizData)], { type: "application/json" }));
    if (img) formData.append("img", img);

    try {
      await axios.post(`${URL}/teacher/quizzes/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Thêm Quiz thành công!", { autoClose: 1000 });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error("Không thể thêm Quiz!", { autoClose: 1000 });
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <label className="w-1/4 font-medium">Course:</label>
      <div>
        <select
          name="courseId"
          className="w-full p-2 border rounded"
          value={selectedCourseId}  // Đảm bảo rằng value là ID khóa học (courseId)
          onChange={(e) => setSelectedCourseId(e.target.value)}  // Cập nhật giá trị khi thay đổi
        >
          <option value="">-- Chọn khoá học --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>  // Giá trị của option là course.id
              {course.courseName}  // Hiển thị tên khóa học
            </option>
          ))}
        </select>
      </div>

      <label className="w-1/4 font-medium">Lesson:</label>
      <div>
        <select
          name="lessonId"
          value={quizData.lessonId}  // Đảm bảo rằng value là lessonId từ quizData
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        >
          <option value="">-- Chọn bài học --</option>
          {lessons.map((lesson) => (
            <option key={lesson.lessonId} value={lesson.lessonId}>
              {lesson.lessonName}  // Hiển thị tên bài học
            </option>
          ))}
        </select>
      </div>


        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Quiz Name:</label>
          <input
            type="text"
            name="quizName"
            value={quizData.quizName}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Price:</label>
          <input
            type="number"
            name="price"
            value={quizData.price}
            onChange={handleChange}
            disabled={quizData.quizEnum === "FREE"}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 p-2 border rounded"
          />
        </div>

        {preview && (
          <div className="flex justify-center">
            <img src={preview} alt="Preview" className="w-48 h-32 object-cover rounded shadow" />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Description:</label>
          <textarea
            name="description"
            value={quizData.description}
            onChange={handleChange}
            rows={3}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Type:</label>
          <select
            name="quizEnum"
            value={quizData.quizEnum}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
          >
            <option value="FREE">Free</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-500 text-gray-600 rounded hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
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
