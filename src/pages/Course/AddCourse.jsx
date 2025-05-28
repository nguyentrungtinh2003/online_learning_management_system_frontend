import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [courseData, setCourse] = useState({
    courseName: "",
    description: "",
    img: "",
    price: "0",
    courseEnum: "FREE",
    isDeleted: false,
    userId: localStorage.getItem("id"),
  });

  const [reloadTrigger, setReloadTrigger] = useState(false);
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

  const handleReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi trạng thái để kích hoạt useEffect
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

    if (loading || isSubmitted) return;

    const missingFields = [];

    if (!courseData.courseName.trim()) missingFields.push(t("courseName"));
    if (!courseData.description.trim()) missingFields.push(t("description"));
    if (!courseData.courseEnum.trim()) missingFields.push(t("courseType"));
    if (!img) missingFields.push(t("image"));
    if (
      courseData.courseEnum === "PAID" &&
      (!courseData.price || parseFloat(courseData.price) <= 0)
    ) {
      missingFields.push(t("validPrice"));
    }

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p>{t("Thiếu thông tin !")}</p>
          <ul className="list-disc list-inside">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>,
        { autoClose: 1000 }
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (img) formData.append("img", img);

    const courseJson = new Blob([JSON.stringify(courseData)], {
      type: "application/json",
    });
    formData.append("course", courseJson);

    try {
      const result = await addCourse(courseData, img);
      // ✅ Lưu khóa học mới vào localStorage để CourseManagement có thể nhận
      const newCourse = {
        id: result.id,
        courseName: result.courseName,
        price: result.price,
        deleted: result.deleted,
        img: result.img,
        description: result.description,
        courseEnum: result.courseEnum,
      };

      // Đọc cache từ localStorage
      const savedCache = localStorage.getItem("courseCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));

        // Xác định key phù hợp dựa theo bộ lọc hiện tại (giống trong CourseManagement)
        const key = `--ALL--ALL`; // Nếu bạn đang để mặc định là All, bạn có thể điều chỉnh theo search/filter thực tế
        const existingCourses = parsedCache.get(key) || [];

        // Thêm khóa học mới vào danh sách hiện tại
        const updatedCourses = [...existingCourses, newCourse];
        parsedCache.set(key, updatedCourses);

        // Lưu lại vào localStorage
        localStorage.setItem(
          "courseCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );
      }

      // Dùng cho trường hợp API chạy quá chậm
      // Xóa cache
      // localStorage.removeItem("courseCache");

      // Nếu cần, trigger lại reload để tái tạo lại cache trong CourseManagement
      window.dispatchEvent(new Event("triggerCourseReload"));

      queryClient.invalidateQueries(["freeCourses"]);
      queryClient.invalidateQueries(["proCourses"]);

      toast.success(t("Success!"), { autoClose: 1000 });
      setIsSubmitted(true);

      handleReload();
      setTimeout(() => {
        navigate("/admin/courses", { state: { reload: true } });
      }, 1000);
    } catch (error) {
      console.error("Submit Error:", error);
      const message = error?.response?.data?.message || t("Error!");
      toast.error(`❌ ${message}`, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("courseManagement")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addCourse.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          {/* Course Name & Price */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addCourse.courseName")}
            </label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              placeholder="Enter Course Name"
              className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("price")}</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
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
              placeholder={t("Enter Description")}
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
            <button
              onClick={() => !loading && navigate(-1)}
              disabled={loading || isSubmitted}
              className={`px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer`}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitted}
              className={`px-6 py-2 rounded-lg ${
                loading || isSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-scolor text-wcolor hover:bg-opacity-80"
              }`}
            >
              {loading ? (
                <p>{t("processing")}</p>
              ) : isSubmitted ? (
                <p>{t("submitted")}</p>
              ) : (
                <p>{t("submit")}</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
