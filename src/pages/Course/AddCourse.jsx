import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import FormData from 'form-data';
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

import URL from "../../config/URLconfig";

const AddCourse = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    img:"",
    price: "",
    courseEnum: "FREE",
    isDeleted:false,
    userId: localStorage.getItem("id"),
  });

  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const userId = localStorage.getItem("id");
  //   const token = localStorage.getItem("token");

  //   if (!token || !userId) {
  //     console.warn("⚠️ Token hoặc userId không tồn tại.");
  //     return;
  //   }

  //   axios
  //     .get(
  //       `https://codearena-backend-dev.onrender.com/api/auth/user/${userId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then((res) => {
  //       setCourseData((prev) => ({
  //         ...prev,
  //         user: { id: res.data?.id || "1" },
  //       }));
  //     })
  //     .catch((err) => {
  //       console.error("❌ Lỗi lấy thông tin người dùng:", err);
  //     });
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });

    if (name === "price") {
      const parsedPrice = parseFloat(value);
      setCourseData((prev) => ({
        ...prev,
        price: value,
        courseEnum: parsedPrice === 0 ? "FREE" : "PAID",
      }));
    } else {
      setCourseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEnumChange = (e) => {
    const selectedType = e.target.value;

    setCourseData((prev) => {
      let newPrice = prev.price;

      if (selectedType === "FREE") {
        newPrice = "0";
      } else if (parseFloat(prev.price) <= 0) {
        newPrice = "1"; // Đặt mặc định 1 nếu là PAID nhưng price <= 0
      }

      return {
        ...prev,
        courseEnum: selectedType,
        price: newPrice,
      };
    });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (courseData.courseEnum === "PAID" && parseFloat(courseData.price) <= 0) {
      toast.error("❌ Vui lòng nhập giá lớn hơn 0 cho khóa học trả phí.", { autoClose: 1000 });
      return;
    }
  
    setLoading(true);

    const formData = new FormData();

    if (img) {
      formData.append("img", img);
    }
  
    // Thêm thông tin course dưới dạng JSON Blob
    const courseJson = new Blob([JSON.stringify(courseData)], { type: "application/json" });
    formData.append("course", courseJson);   
    
    console.log("courseData JSON:", JSON.stringify(courseData, null, 2));
    try {
      const res = await axios.post(`${URL}/teacher/courses/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      toast.success("🎉 Thêm khóa học thành công!", { autoClose: 1000 });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Submit Error:", error);
      const message = error?.response?.data?.message || "Đã xảy ra lỗi khi thêm khóa học.";
      toast.error(`❌ ${message}`, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-full flex flex-col w-full py-4 px-3">
      <div className="flex dark:text-darkText gap-2 items-center mb-4">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Course Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">Add New Course</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-wcolor text-gray-700 dark:bg-darkBackground dark:border dark:border-darkBorder dark:text-darkText p-6 rounded-lg shadow space-y-4"
      >
        {/* Course Name & Price */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">
            Course Title:
          </label>
          <input
            type="text"
            name="courseName"
            value={courseData.courseName}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Price:</label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">
            Description:
          </label>
          <textarea
            name="description"
            rows={3}
            value={courseData.description}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Course Type */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">Type:</label>
          <select
            name="courseEnum"
            value={courseData.courseEnum}
            onChange={handleEnumChange}
            className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="FREE">Free</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor text-ficolor dark:text-darkText rounded-lg hover:bg-opacity-80 cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-scolor text-wcolor hover:bg-opacity-80"
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

export default AddCourse;
