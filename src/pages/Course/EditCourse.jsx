import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { getCourseById, updateCourse } from "../../services/courseapi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";

const EditCourse = () => {
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const queryClient = new QueryClient();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const [courseData, setCourse] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "",
    userId: localStorage.getItem("id"),
  });

  const [initialCourse, setInitialCourse] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "",
    userId: localStorage.getItem("id"),
  });

  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        // console.log("Fetched Course Data:", courseData); // In dữ liệu nhận được từ API

        if (response && response.data) {
          const formattedData = {
            courseName: response.data.courseName || "",
            description: response.data.description || "",
            price: response.data.price || "0",
            img: response.data.img || "",
            courseEnum: response.data.courseEnum || "FREE",
            userId: response.data.user?.id || localStorage.getItem("id"),
          };

          setCourse(formattedData);
          setInitialCourse(formattedData);

          // console.log("Formatted Course Data:", formattedData); // In dữ liệu đã format
        } else {
          setError("Không thể tải dữ liệu khóa học");
        }
      } catch (err) {
        setError("Không thể tải dữ liệu khóa học");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const parsedPrice = parseFloat(value);
      setCourse((prev) => ({
        ...prev,
        price: value,
        courseEnum: parsedPrice === 0 ? "FREE" : "PAID",
      }));
    } else {
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEnumChange = (e) => {
    const selectedType = e.target.value;

    setCourse((prev) => {
      let newPrice = prev.price;

      if (selectedType === "FREE") {
        newPrice = "0";
      } else if (parseFloat(prev.price) <= 0) {
        newPrice = "1";
      }

      return {
        ...prev,
        courseEnum: selectedType,
        price: newPrice,
      };
    });
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

  const handleDescriptionChange = (value) => {
    setCourse((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi trạng thái để kích hoạt useEffect
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu đang loading hoặc đã submit rồi
    if (loading || isSubmitted) return;

    // Kiểm tra xem dữ liệu có thay đổi không
    const isDataUnchanged =
      courseData.courseName === initialCourse.courseName &&
      courseData.description === initialCourse.description &&
      courseData.price === initialCourse.price &&
      courseData.courseEnum === initialCourse.courseEnum &&
      courseData.img === initialCourse.img &&
      !img;

    // Nếu dữ liệu không thay đổi, chỉ cần quay lại
    if (isDataUnchanged) {
      navigate(-1); // Quay lại trang trước
      return;
    }

    const missingFields = [];

    // Kiểm tra các trường bắt buộc và độ dài
    if (!courseData.courseName.trim()) {
      missingFields.push(t("courseName"));
    } else if (courseData.courseName.length > 255) {
      toast.error(t("Tên khóa học không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
    }

    if (!courseData.description.trim()) {
      missingFields.push(t("description"));
    } else if (courseData.description.length > 255) {
      toast.error(t("Mô tả không được vượt quá 255 ký tự"), {
        autoClose: 2000,
      });
      return;
    }

    if (!courseData.courseEnum.trim()) missingFields.push(t("courseType"));
    if (!img && !courseData.img) missingFields.push(t("image"));
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
    formData.append(
      "course",
      new Blob([JSON.stringify(courseData)], { type: "application/json" })
    );

    try {
      const result = await updateCourse(id, courseData, img);

      // ✅ Cập nhật localStorage nếu có khóa học trong cache
      const savedCache = localStorage.getItem("courseCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));

        const key = `--ALL--ALL`; // hoặc tùy theo bộ lọc thực tế đang dùng
        const existingCourses = parsedCache.get(key) || [];

        // Cập nhật khóa học trong danh sách
        const updatedCourses = existingCourses.map((course) =>
          course.id === id
            ? {
                ...course,
                courseName: courseData.courseName,
                price: courseData.price,
                img: result.img || course.img,
                courseEnum: courseData.courseEnum,
              }
            : course
        );

        parsedCache.set(key, updatedCourses);

        localStorage.setItem(
          "courseCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );
      }

      // Dùng cho trường hợp API chạy quá chậm
      // Xóa cache
      // localStorage.removeItem("courseCache");
      window.dispatchEvent(new Event("triggerCourseReload"));

      queryClient.invalidateQueries(["freeCourses"]);
      queryClient.invalidateQueries(["proCourses"]);

      toast.success("Course updated successfully!", {
        autoClose: 1000,
        position: "top-right",
      });
      setIsSubmitted(true);

      handleReload();
      setTimeout(() => {
        navigate("/admin/courses", { state: { reload: true } });
      }, 1000);
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("Failed to updating course!", {
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
            {t("editCourse.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          {/* Course Name & Price */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editCourse.courseName")}
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
              className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          {/* Current Image */}
          {courseData.img && !imgPreview && (
            <div className="mt-4 items-center flex space-x-4">
              <h3 className="font-medium w-1/4">
                {t("editCourse.currentImage")}
              </h3>
              <img
                src={courseData.img}
                alt="Current Image"
                className="mt-2 max-w-[200px] h-auto border-2 dark:border-darkBorder border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* Image Preview */}
          {imgPreview && (
            <div className="mt-4 text-center">
              <h3 className="font-medium">{t("editCourse.imagePreview")}</h3>
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
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Submit Button */}
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
      <ToastContainer />
    </div>
  );
};

export default EditCourse;
