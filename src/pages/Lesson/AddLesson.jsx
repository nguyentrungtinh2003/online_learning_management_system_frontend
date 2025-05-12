import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const AddLesson = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    lessonName: "",
    description: "",
    date: "",
    courseId: "", // gán sau khi chọn
    isDeleted: false,
  });

  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "48px",
      fontSize: "16px",
      padding: "4px 8px",
      width: "800px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // đảm bảo hiển thị trên cùng
    }),
  };

  // State để kích hoạt re-render khi cần reload
  const [reloadTrigger, setReloadTrigger] = useState(false);

  // Hàm xử lý khi có sự kiện "triggerCourseReload" từ component khác
  const handleReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi trạng thái để kích hoạt useEffect reload dữ liệu
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // /// EFFECT 1: Đăng ký lắng nghe sự kiện reload từ nơi khác trong app
  useEffect(() => {
    const handleReload = () => {
      triggerReload((prev) => !prev);
    };
    window.addEventListener("triggerCourseReload", handleReload);
    return () =>
      window.removeEventListener("triggerCourseReload", handleReload);
  }, []);

  // /// Hàm: Load danh sách khóa học từ localStorage (nếu có)
  const loadCoursesFromCache = () => {
    const cachedCourses = JSON.parse(localStorage.getItem("listCourse"));
    if (cachedCourses) {
      setCourses(cachedCourses);
    }
  };

  // /// EFFECT 2: Khi reloadTrigger thay đổi => load lại danh sách khóa học từ cache
  useEffect(() => {
    loadCoursesFromCache();
    fetchCourses();
  }, [reloadTrigger]);

  // /// EFFECT 3: Khi component mount lần đầu => lấy danh sách khóa học
  // Ưu tiên từ localStorage, nếu không có thì gọi API fetchCourses()
  useEffect(() => {
    const cachedCourses = JSON.parse(localStorage.getItem("listCourse"));
    if (cachedCourses) {
      setCourses(cachedCourses);
    } else {
      fetchCourses();
    }
  }, []);
  console.log(courses); // Kiểm tra xem courses có chứa khóa học mới không
  console.log(filteredCourses); // Kiểm tra filteredCourses sau khi lọc

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://codearena-backend-dev.onrender.com/api/courses/all",
        {
          withCredentials: true,
        }
      );
      setCourses(res.data?.data || []);
      localStorage.setItem("listCourse", JSON.stringify(res.data?.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh sách khoá học:", error);
    }
  };

  const handleChange = (e) => {
    setLessonData({ ...lessonData, [e.target.name]: e.target.value });
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

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDescriptionChange = (value) => {
    setLessonData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || isSubmitted) return;

    const missingFields = [];

    if (!lessonData.lessonName.trim()) missingFields.push(t("lessonName"));
    if (!lessonData.description.trim()) missingFields.push(t("description"));
    if (!video) missingFields.push(t("video"));
    if (!img) missingFields.push(t("image"));
    if (!lessonData.courseId) missingFields.push(t("addLesson.selectCourse"));

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
    if (video) formData.append("video", video);

    formData.append(
      "lesson",
      new Blob([JSON.stringify(lessonData)], { type: "application/json" })
    );

    try {
      const response = await axios.post(
        "https://codearena-backend-dev.onrender.com/api/teacher/lessons/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const result = response.data?.data;

      // ✅ Lưu bài học mới vào localStorage để LessonManagement có thể nhận
      const newLesson = {
        id: result.id,
        lessonName: result.lessonName,
        deleted: result.deleted,
        img: result.img,
        description: result.description,
        video: result.video,
      };

      // Đọc cache từ localStorage
      const savedCache = localStorage.getItem("lessonCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));

        // Xác định key phù hợp dựa theo bộ lọc hiện tại (giống trong CourseManagement)
        const key = `--ALL--ALL`; // Nếu bạn đang để mặc định là All, bạn có thể điều chỉnh theo search/filter thực tế
        const existingLessons = parsedCache.get(key) || [];

        // Thêm khóa học mới vào danh sách hiện tại
        const updatedLessons = [...existingLessons, newLesson];
        parsedCache.set(key, updatedLessons);

        // Lưu lại vào localStorage
        localStorage.setItem(
          "lessonCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );
      }

      // Dùng cho trường hợp API chạy quá chậm
      // Xóa cache
      // localStorage.removeItem("lessonCache");

      // Nếu cần, trigger lại reload để tái tạo lại cache trong LessonManagement
      window.dispatchEvent(new Event("triggerCourseReload"));

      toast.success(<p>{t("addLesson.success")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
      setIsSubmitted(true);
      handleReload();

      setTimeout(() => {
        navigate("/admin/lessons", { state: { reload: true } });
      }, 1000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error(<p>{t("addLesson.error")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex gap-2 dark:text-darkText">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("addLesson.main")}</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">{t("addLesson.add")}</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder dark:text-darkText p-6 rounded-lg shadow"
      >
        <div className="space-y-4">
          {/* Chọn khoá học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("addLesson.selectCourse")}</label>
            <select
              name="courseId"
              value={lessonData.courseId}
              onChange={handleChange}
              className="flex-1 px-4 border-2 dark:border-darkBorder dark:bg-darkSubbackground py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            >
              <option value="">{t("addLesson.selectCoursePlaceholder")}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Các trường nhập bài học */}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("addLesson.lessonTitle")}
            </label>
            <input
              type="text"
              name="lessonName"
              value={lessonData.lessonName}
              onChange={handleChange}
              placeholder={t("addLesson.enterLesson")}
              className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("image")}</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="flex-1 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          {/* Image Preview */}
          {imgPreview && (
            <div className="mt-4 text-center">
              {" "}
              {/* Thêm text-center để căn giữa */}
              <h3 className="font-medium">{t("addLesson.imagePreview")}</h3>
              <img
                src={imgPreview}
                alt="Preview"
                className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("video")}</label>
            <input
              type="file"
              onChange={handleVideoChange}
              className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("description")}</label>
            <ReactQuill
              theme="snow"
              value={lessonData.description}
              onChange={handleDescriptionChange}
              placeholder={t("Enter Description")}
              className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
              style={{ minHeight: "300px" }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => !loading && navigate(-1)}
            disabled={loading || isSubmitted}
            className={`px-6 py-2 border-2 border-sicolor text-ficolor dark:text-darkText rounded-lg hover:bg-opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-scolor text-ficolor hover:bg-opacity-80"
            }`}
            disabled={loading}
          >
            {loading ? (
              <p>{t("processing")}</p>
            ) : isSubmitted ? (
              <p>{t("submitted")}</p>
            ) : (
              <p>{t("submit")}</p>
            )}{" "}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddLesson;
