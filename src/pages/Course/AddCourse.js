import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    price: "",
    type: "",
    lecturer: "",
    user: { id: "" }, // Khởi tạo user ID rỗng
    lessons: [],
  });
  const [img, setImg] = useState(null);

  useEffect(() => {
    // Mặc định User ID là 1 trước
    setCourseData((prev) => ({
      ...prev,
      user: { id: "1" },
    }));
  
    const userIdFromStorage = localStorage.getItem("id") || "1"; // Dùng 1 nếu không có trong localStorage
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("⚠️ Không tìm thấy token, dùng user ID mặc định.");
      return;
    }
  
    axios
      .get(`https://codearena-backend-dev.onrender.com/api/auth/user/${userIdFromStorage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("✅ User Info:", response.data);
  
        const userIdFromAPI = response.data?.id || response.data?.user?.id || "1";
  
        setCourseData((prev) => ({
          ...prev,
          user: { id: userIdFromAPI },
        }));
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy thông tin user:", error);
        // Giữ nguyên ID = 1 nếu lỗi
      });
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem("id"); // Lấy userId từ localStorage


    if (!courseData.user.id) {
      console.error("User ID is missing, aborting request.");
      alert("Lỗi: Không có User ID. Vui lòng thử lại.");
      return;
    }
  
    console.log("Course Data trước khi gửi:", courseData);
  
    const formData = new FormData();
    formData.append("course", new Blob([JSON.stringify(courseData)], { type: "application/json" }));
  
    if (img) {
      formData.append("img", img);
    }

    console.log("📤 Sending course data:", courseData);

    try {
      const response = await axios.post(
        "https://codearena-backend-dev.onrender.com/api/courses/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };


  return (
    <div className="flex-1 flex flex-col h-fit p-6">
      <AdminNavbar />
      <div className="flex gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Course Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Add New Course</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Course Title:</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Description:</label>
            <textarea
              name="description"
              rows={3}
              value={courseData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Price:</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Type:</label>
            <select
              name="type"
              value={courseData.type}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            >
              <option>Select Type</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Link to="/admin/courses" className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
