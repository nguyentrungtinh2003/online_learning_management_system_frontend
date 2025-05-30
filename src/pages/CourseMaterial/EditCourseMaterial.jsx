import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdNavigateNext } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";

const EditCourseMaterial = () => {
  const { t } = useTranslation("adminmanagement");
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const { id } = useParams(); // id của tài liệu cần sửa
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [materialData, setMaterialData] = useState({
    id: "",
    title: "",
    description: "",
    courseId: "",
    courseName: "",
    lecturerId: "",
    lecturerName: "",
  });
  const [initialMaterial, setInitialMaterial] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "",
    userId: localStorage.getItem("id"),
  });
  const [file, setFile] = useState(null);

  // Lấy danh sách khóa học
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
      .catch((err) => console.error("Lỗi lấy danh sách khóa học:", err));
  }, [id]);

  // Lấy dữ liệu tài liệu hiện tại
  useEffect(() => {
    axios
      .get(`${URL}/course-materials/${parseInt(id)}`, { withCredentials: true })
      .then((res) => {
        const data = res.data.data;
        setMaterialData({
          id: data.id,
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          courseName: data.courseName,
          lecturerId: data.lecturerId,
          lecturerName: data.lecturerName,
        });
        setLoading(false); // ✅ Thêm dòng này để dừng loading
      })
      .catch((err) => {
        console.error("Lỗi lấy tài liệu:", err);
        setLoading(false); // ✅ Dù có lỗi cũng phải dừng loading
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (selectedOption) => {
    setMaterialData((prev) => ({
      ...prev,
      courseId: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (loading || isSubmitted) return;

    const isDataUnchanged =
      materialData.title === initialMaterial.title &&
      materialData.description === initialMaterial.description &&
      !file;

    if (isDataUnchanged) {
      navigate(-1); // Quay lại nếu không có thay đổi
      return;
    }

    const missingFields = [];

    if (!materialData.title.trim()) {
      missingFields.push(t("title"));
    } else if (materialData.title.length > 255) {
      toast.error(t("Tên tài liệu không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
    }

    if (!materialData.description.trim()) {
      missingFields.push(t("description"));
    } else if (materialData.description.length > 255) {
      toast.error(t("Mô tả không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
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
    const blob = new Blob([JSON.stringify(materialData)], {
      type: "application/json",
    });
    formData.append("course-material", blob);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.put(
        `${URL}/course-materials/update/${parseInt(id)}`,
        formData,
        {
          withCredentials: true,
        }
      );

      // ✅ Cập nhật localStorage nếu có course material trong cache
      const savedCache = localStorage.getItem("materialCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));

        const key = `--ALL--ALL`; // hoặc thay đổi theo bộ lọc đang dùng thực tế
        const existingMaterials = parsedCache.get(key) || [];

        // Cập nhật course material trong danh sách
        const updatedMaterials = existingMaterials.map((material) =>
          material.id === parseInt(id)
            ? {
                ...material,
                // ✅ Cập nhật các thuộc tính cần thay đổi
                title: formData.get("title"),
                type: formData.get("type"),
                description: formData.get("description"),
                url: formData.get("url"),
                // Nếu bạn có upload file ảnh, thêm logic cập nhật ảnh ở đây
              }
            : material
        );

        parsedCache.set(key, updatedMaterials);

        localStorage.setItem(
          "materialCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );
      }

      window.dispatchEvent(new Event("triggerCourseMaterialReload"));

      // ❗Tuỳ chọn: Cập nhật localStorage nếu cần như bên courseCache

      toast.success(t("Cập nhật tài liệu thành công!"), {
        autoClose: 1000,
        position: "top-right",
      });

      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/admin/course-material", { state: { reload: true } });
      }, 1000);
    } catch (error) {
      console.error("Lỗi cập nhật tài liệu:", error.message);
      toast.error(t("Cập nhật thất bại!"), {
        autoClose: 1000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // if (loading)
  //   return (
  //     <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
  //       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
  //     </div>
  //   );

  return (
    <div className="w-full h-full bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaFileAlt size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("courseMaterialManagement")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("editMaterial.title")}
          </h2>
        </div>

        <div className="flex flex-col h-full justify-between">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 p-2 text-gray-700 dark:text-darkText"
          >
            {/* Title */}
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

            {/* Description */}
            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("description")}</label>
              <textarea
                name="description"
                value={materialData.description}
                onChange={handleChange}
                placeholder={t("addMaterial.descriptionPlaceholder")}
                className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* File Upload */}
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

            {/* Current File Links */}
            {materialData.file && (
              <div className="ml-1 text-sm flex gap-3 items-center dark:text-darkText">
                <a
                  href={materialData.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {t("View File")}
                </a>
                <span>|</span>
                <a
                  href={materialData.file}
                  download
                  className="text-green-600 underline hover:text-green-800"
                >
                  {t("Download")}
                </a>
              </div>
            )}

          {/* Course Select */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addMaterial.selectCourse")}
            </label>
            <div className="flex-1">
              <select
                name="courseId"
                value={materialData.courseId}
                onChange={handleChange}
                className="flex-1 w-full px-4 border-2 dark:border-darkBorder dark:bg-darkSubbackground py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                required
              >
                <option value="">{t("addMaterial.searchAndSelect")}</option>
                {courses.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => !loading && navigate(-1)}
              disabled={loading || isSubmitted}
              type="button"
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading || isSubmitted}
              className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${
                loading || isSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-scolor text-wcolor hover:bg-opacity-80"
              }`}
              style={{ minWidth: "120px" }} // bạn có thể tăng hoặc giảm width tùy ý
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
              )}
              <span>
                {loading
                  ? t("processing")
                  : isSubmitted
                  ? t("submitted")
                  : t("submit")}
              </span>
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourseMaterial;
