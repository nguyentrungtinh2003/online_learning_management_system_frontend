import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import FormData from "form-data";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

import URL from "../../config/URLconfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addCourse } from "../../services/courseapi";
import { useTranslation } from "react-i18next";

const AddCourse = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [courseData, setCourse] = useState({
    courseName: "",
    description: "",
    img: "",
    price: "",
    courseEnum: "FREE",
    isDeleted: false,
    userId: localStorage.getItem("id"),
  });

  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...courseData, [name]: value });

    if (name === "price") {
      const parsedPrice = parseFloat(value);
      setCourse((prev) => ({
        ...prev,
        price: value,
        courseEnum: parsedPrice === 0 ? "FREE" : "PAID",
      }));
    } else {
      setCourse((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEnumChange = (e) => {
    const selectedType = e.target.value;

    setCourse((prev) => {
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

  const handleDescriptionChange = (value) => {
    setCourse((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Lấy file ảnh đầu tiên người dùng chọn
    if (file) {
      setImg(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Sau khi đọc xong file, chúng ta gán kết quả vào state để hiển thị
        setImgPreview(reader.result);
      };

      // Đọc file ảnh dưới dạng URL data
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu đang loading hoặc đã submit rồi
    if (loading || isSubmitted) return;

    // Validate that all fields are filled
    if (
      !courseData.courseName ||
      !courseData.description ||
      !courseData.price ||
      !courseData.courseEnum.trim() ||
      !img
    ) {
      toast.error(<p>{t("toastMissingFields")}</p>, {
        autoClose: 1000,
      });
      return;
    }

    if (courseData.courseEnum === "PAID" && parseFloat(courseData.price) <= 0) {
      toast.error(<p>{t("toastPriceError")}</p>, {
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (img) {
      formData.append("img", img);
    }

    // Thêm thông tin course dưới dạng JSON Blob
    const courseJson = new Blob([JSON.stringify(courseData)], {
      type: "application/json",
    });
    formData.append("course", courseJson);

    console.log("courseData JSON:", JSON.stringify(courseData, null, 2));
    try {
      const result = await addCourse(courseData, img);
      toast.success(<p>{t("toastSuccess")}</p>, { autoClose: 1000 });
      setIsSubmitted(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Submit Error:", error);
      const message =
        error?.response?.data?.message || <p>{t("toastError")}</p>;
      toast.error(`❌ ${message}`, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex dark:text-darkText gap-2 items-center mb-4">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">{t("courseManagement")}</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold">{t("addCourse.title")}</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-wcolor text-gray-700 dark:bg-darkBackground dark:border-2 dark:border-darkBorder dark:text-darkText p-6 rounded-lg shadow space-y-4"
      >
        {/* Course Name & Price */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">{t("addCourse.courseName")}</label>
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
          <label className="w-1/4 font-medium">{t("price")}</label>
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
          <label className="w-1/4 font-medium">{t("image")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
          />
        </div>

        {/* Image Preview */}
        {imgPreview && (
          <div className="mt-4 text-center">
            {" "}
            {/* Thêm text-center để căn giữa */}
            <h3 className="font-medium">{t("addCourse.imagePreview")}</h3>
            <img
              src={imgPreview}
              alt="Preview"
              className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
            />
          </div>
        )}

        {/* Description */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">{t("description")}</label>
          <ReactQuill
            theme="snow"
            value={courseData.description}
            onChange={handleDescriptionChange}
            className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* Course Type */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 font-medium">{t("type")}</label>
          <select
            name="courseEnum"
            value={courseData.courseEnum}
            onChange={handleEnumChange}
            className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="FREE">{t("free")}</option>
            <option value="PAID">{t("paid")}</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor text-ficolor dark:text-darkText rounded-lg hover:bg-opacity-80 cursor-pointer"
          >
           {t("cancel")}
          </Link>
          <button
            type="submit"
            disabled={loading || isSubmitted}
            className={`px-6 py-2 rounded-lg ${
              loading || isSubmitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-scolor text-wcolor hover:bg-opacity-80"
            }`}
          >
            {loading ? <p>{t("processing")}</p> : isSubmitted ? <p>{t("submitted")}</p> : <p>{t("submit")}</p>}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddCourse;
