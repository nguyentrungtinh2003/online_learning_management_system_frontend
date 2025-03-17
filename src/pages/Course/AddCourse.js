import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { addCourse } from "../../services/courseapi";

const AddCourse = () => {
  // State lưu dữ liệu từ form nhập vào
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    img: "",
    price: "",
    courseEnum: "FREE",
    users: [],
    user: { id: 1 },
    lessons: [],
  });
  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn trang reload

    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(courseData)], { type: "application/json" })
    );

    if (img) {
      formData.append("img", img);
    }

    try {
      const response = await axios.post(
        "https://codearena-backend-dev.onrender.com/api/courses/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Thành công:", response.data);
      alert("Thêm khóa học thành công!");
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      alert("Lỗi khi thêm khóa học!");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-fit py-6 px-3">
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
          {[
            { label: "Course Title:", name: "courseName", type: "text" },
            { label: "Price:", name: "price", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={courseData[name]}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
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
              value={courseData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Type:</label>
            <select
              name="courseEnum"
              value={courseData.courseEnum}
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
            to="/admin/courses"
            className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
