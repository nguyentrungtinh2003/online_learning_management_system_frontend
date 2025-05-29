import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const AddCourseMaterial = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [courses, setCourses] = useState([]);
  const [materialData, setMaterialData] = useState({
    title: "",
    description: "",
    courseId: "",
    lecturerId: parseInt(localStorage.getItem("id")),
    isDeleted: false,
  });

  const [file, setFile] = useState(null);

  // Gọi API để lấy danh sách khóa học
  useEffect(() => {
    axios
      .get(`${URL}/courses/all`, { withCredentials: true })
      .then((res) => {
        const options = res.data.data.map((course) => ({
          value: course.id,
          label: course.courseName,
        }));
        setCourses(options);
      })
      .catch((err) => console.log("Lỗi lấy danh sách khóa học: ", err));
  }, []);

  // Xử lý nhập dữ liệu khác (title, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Xử lý chọn khóa học từ react-select
  const handleCourseSelect = (selectedOption) => {
    setMaterialData((prev) => ({
      ...prev,
      courseId: selectedOption ? selectedOption.value : "",
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    const courseMaterialDTO = {
      title: materialData.title,
      description: materialData.description,
      courseId: materialData.courseId,
      lecturerId: materialData.lecturerId,
    };

    const blob = new Blob([JSON.stringify(courseMaterialDTO)], {
      type: "application/json",
    });

    formData.append("course-material", blob);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post(`${URL}/course-materials/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success("🎉 Thêm tài liệu thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/course-material");
    } catch (error) {
      console.error("Lỗi khi thêm tài liệu:", error);
      toast.error("❌ Đã xảy ra lỗi khi thêm tài liệu!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-full h-full bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("courseMaterialManagement")}</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("addMaterial.title")}</h2>
        </div>

        <div className="flex flex-col h-full justify-between">
          <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          {/* Tiêu đề */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addMaterial.titleLabel")}
            </label>
            <input
              type="text"
              name="title"
              value={materialData.title}
              onChange={handleChange}
              placeholder={t("addMaterial.titlePlaceholder")}
              className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("description")}</label>
            <textarea
              name="description"
              value={materialData.description}
              onChange={handleChange}
              placeholder={t("addMaterial.descriptionPlaceholder")}
              className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            ></textarea>
          </div>

          {/* Chọn file */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addMaterial.selectFile")}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          {/* Chọn khóa học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addMaterial.selectCourse")}
            </label>
            <div className="flex-1">
              <Select
                options={courses}
                onChange={handleCourseSelect}
                placeholder={t("addMaterial.searchAndSelect")}
                isClearable
                className="text-black dark:text-white"
              />
            </div>
          </div>
        </form>
        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => !loading && navigate(-1)}
            disabled={loading || isSubmitted}
            className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${
              loading || isSubmitted
                ? "bg-gray-400"
                : "bg-scolor text-ficolor hover:bg-opacity-80"
            }`}
            disabled={loading || isSubmitted}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
            )}
            {loading
              ? t("processing")
              : isSubmitted
              ? t("submitted")
              : t("submit")}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseMaterial;
