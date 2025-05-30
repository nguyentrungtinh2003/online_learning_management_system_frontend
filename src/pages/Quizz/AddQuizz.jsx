import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { FaBuffer } from "react-icons/fa";
import URL from "../../config/URLconfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const AddQuizz = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    price: "0.0",
    img: "",
    date: "",
    quizEnum: "FREE",
    lessonId: "",
  });

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [imgPreview, setImgPreview] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "48px",
      fontSize: "16px",
      padding: "4px 8px",
      width: "1218px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  // State để kích hoạt re-render khi cần reload
  const [reloadTrigger, setReloadTrigger] = useState(false);

  // Hàm xử lý khi có sự kiện "triggerCourseReload" từ component khác
  const handleReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi trạng thái để kích hoạt useEffect reload dữ liệu
  };
  // === Trigger reload khi có sự kiện bên ngoài gửi tới
  useEffect(() => {
    const reloadHandler = () => {
      setReloadTrigger((prev) => !prev);
    };

    window.addEventListener("triggerCourseReload", reloadHandler);
    window.addEventListener("triggerLessonReload", reloadHandler); // cả 2 sự kiện đều reload

    return () => {
      window.removeEventListener("triggerCourseReload", reloadHandler);
      window.removeEventListener("triggerLessonReload", reloadHandler);
    };
  }, []);

  // === Tải lại danh sách course mỗi khi reloadTrigger thay đổi
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${URL}/courses/all`, {
          withCredentials: true,
        });
        const courseData = res.data?.data || [];
        setCourses(courseData);
        localStorage.setItem("courses", JSON.stringify(courseData));
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      fetchCourses();
    }
    fetchCourses();
  }, [reloadTrigger]);

  // === Tải lại danh sách lessons mỗi khi selectedCourseId hoặc reloadTrigger thay đổi
  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      return;
    }

    const fetchLessons = async () => {
      try {
        const res = await axios.get(
          `${URL}/teacher/lessons/courses/${selectedCourseId}/all`,
          {
            withCredentials: true,
          }
        );
        const lessonData = res.data?.data || [];
        setLessons(lessonData);
        localStorage.setItem(
          `lessons-${selectedCourseId}`,
          JSON.stringify(lessonData)
        );
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessons([]);
      }
    };

    const storedLessons = localStorage.getItem(`lessons-${selectedCourseId}`);
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    } else {
      fetchLessons();
    }
    fetchLessons();
  }, [selectedCourseId, reloadTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseId") {
      setSelectedCourseId(value);
      setQuizData((prev) => ({ ...prev, lessonId: value }));
    } else if (name === "quizEnum") {
      setQuizData((prev) => ({
        ...prev,
        quizEnum: value,
        price: value === "FREE" ? "0" : prev.price === "0" ? "1" : prev.price,
      }));
    } else if (name === "lessonId") {
      setQuizData((prev) => ({ ...prev, lessonId: value }));
    } else if (name === "price") {
      let sanitized = value.replace(/^0+(?=\d)/, ""); // bỏ số 0 ở đầu

      if (sanitized === "") sanitized = "0"; // nếu xóa hết thì thành 0
      else if (parseInt(sanitized) < 1 || isNaN(parseInt(sanitized)))
        sanitized = "1";

      const priceValue = parseFloat(sanitized);
      const quizEnumValue = priceValue === 0 ? "FREE" : "PAID";

      setQuizData((prev) => ({
        ...prev,
        price: sanitized,
        quizEnum: quizEnumValue,
      }));
    } else {
      setQuizData((prev) => ({ ...prev, [name]: value }));
    }
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
    if (loading) return;

    const missingFields = [];

    if (!quizData.quizName.trim()) missingFields.push(t("quizName"));
    if (!quizData.description.trim()) missingFields.push(t("description"));
    if (!quizData.courseId) missingFields.push(t("addQuiz.selectCourse"));
    if (!quizData.lessonId) missingFields.push(t("addQuiz.selectLesson"));

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

    const updatedQuizData = { ...quizData };
    delete updatedQuizData.courseId;

    const formData = new FormData();
    formData.append(
      "quiz",
      new Blob([JSON.stringify(updatedQuizData)], { type: "application/json" })
    );
    if (img) formData.append("img", img);

    console.log(JSON.stringify(updatedQuizData));

    try {
      const response = await axios.post(
        `${URL}/teacher/quizzes/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const result = response.data?.data;

      // ✅ Tạo lesson mới từ kết quả API
      const newQuiz = {
        id: result.id,
        quizName: result.quizName,
        deleted: result.deleted,
        img: result.img,
        description: result.description,
      };

      // ✅ Xử lý localStorage dạng Map cho lesson cache
      const savedCache = localStorage.getItem("quizCache");
      const parsedCache = savedCache
        ? new Map(JSON.parse(savedCache))
        : new Map();

      // ✅ Key theo courseId (thay vì "--ALL--ALL")
      const key = `${selectedCourseId || "--ALL"}--${
        selectedLessonId || "--ALL"
      }`;
      const existingQuizzes = parsedCache.get(key) || [];

      // ✅ Thêm bài học mới
      const updatedQuizzes = [...existingQuizzes, newQuiz];
      parsedCache.set(key, updatedQuizzes);

      // ✅ Lưu lại vào localStorage
      localStorage.setItem(
        "quizCache",
        JSON.stringify(Array.from(parsedCache.entries()))
      );

      // ✅ Trigger reload để các component như LessonManagement cập nhật lại
      window.dispatchEvent(new Event("triggerQuizReload"));

      toast.success(<p>{t("addQuiz.toastSuccess")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
      // handleReload();

      // setTimeout(() => {
      //   navigate("/admin/quizzes", { state: { reload: true } });
      // }, 1000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(<p>{t("addQuiz.toastError")}</p>, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (value) => {
    setQuizData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("quizz.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addQuiz.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("addQuiz.course")}</label>
            <div className="flex-1">
              <select
                name="courseId"
                value={quizData.courseId}
                onChange={(e) => {
                  const courseId = e.target.value;
                  setQuizData((prev) => ({
                    ...prev,
                    courseId,
                    lessonId: "", // reset lesson khi đổi khóa học
                  }));
                  setSelectedCourseId(courseId); // để load lại danh sách lessons tương ứng
                }}
                className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
                required
              >
                <option value="">{t("addQuiz.selectCourse")}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <label className="w-1/4 font-medium">{t("addQuiz.lesson")}</label>
            <div className="flex-1">
              <select
                name="lessonId"
                value={quizData.lessonId}
                onChange={(e) => {
                  const lessonId = e.target.value;
                  setQuizData((prev) => ({
                    ...prev,
                    lessonId,
                  }));
                }}
                className="flex-1 w-full px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText focus:outline-none focus:ring-2 focus:ring-scolor"
                required
                disabled={!selectedCourseId} // vô hiệu hóa khi chưa chọn khóa học
              >
                <option value="">{t("addQuiz.selectLesson")}</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.lessonName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("addQuiz.quizName")}</label>
            <input
              type="text"
              name="quizName"
              value={quizData.quizName}
              onChange={handleChange}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("price")}</label>
            <input
              type="number"
              name="price"
              value={quizData.price}
              onChange={handleChange}
              disabled={quizData.quizEnum === "FREE"}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("image")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 p-2 border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
            />
          </div>

          {/* Image Preview */}
          {imgPreview && (
            <div className="mt-4 text-center">
              {" "}
              {/* Thêm text-center để căn giữa */}
              <h3 className="font-medium">{t("addQuiz.imagePreview")}</h3>
              <img
                src={imgPreview}
                alt="Preview"
                className="mt-2 max-w-[400px] h-auto border-2 border-gray-300 rounded-lg mx-auto"
              />
            </div>
          )}

          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("description")}</label>
            <ReactQuill
              theme="snow"
              value={quizData.description}
              onChange={handleDescriptionChange}
              placeholder={t("Enter Description")}
              rows={3}
              style={{ minHeight: "300px" }}
              className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">{t("type")}</label>
            <select
              name="quizEnum"
              value={quizData.quizEnum}
              onChange={handleChange}
              className="flex-1 p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded"
            >
              <option value="FREE">{t("free")}</option>
              <option value="PAID">{t("paid")}</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => !loading && navigate(-1)}
              disabled={loading}
              className={`px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer`}
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
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                  {t("processing")}
                </div>
              ) : (
                <p>{t("submit")}</p>
              )}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizz;
