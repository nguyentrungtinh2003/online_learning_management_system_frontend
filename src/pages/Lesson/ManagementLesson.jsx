import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import {
  FaVideo,
  FaEdit,
  FaEye,
  FaPlus,
  FaLockOpen,
  FaLock,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLesson,
  getLessonByPage,
  restoreLesson,
} from "../../services/lessonapi";
import { useTranslation } from "react-i18next";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { useLocation } from "react-router-dom";

export default function ManagementLesson() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const location = useLocation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonSearch, setLessonSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const lessonsPerPage = 6;
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [cache, setCache] = useState(new Map());
  const [courseIdFilter, setCourseIdFilter] = useState("All");

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const stored = localStorage.getItem("courseCache");
  const courseMap = stored ? new Map(JSON.parse(stored)) : new Map();

  // Lấy danh sách khóa học tổng hợp (dùng trong Lesson)
  const courseList = courseMap.get("ALL-DATA") || [];

  const selectedCourse = courseList.find(
    (c) => String(c.id) === String(courseIdFilter)
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("lessonSearch");
    const savedStatusFilter = localStorage.getItem("statusFilter");
    const savedCourseFilter = localStorage.getItem("lessonCourseIdFilter");

    if (savedSearch) setLessonSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
    if (savedCourseFilter) setCourseIdFilter(savedCourseFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerLessonReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("lessonCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerLessonReload", handleReload);

    return () => {
      window.removeEventListener("triggerLessonReload", handleReload);
    };
  }, []);
  // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // Effect 3: Lọc bài học từ cache và phân trang khi cache thay đổi
  useEffect(() => {
    if (!cache.has("ALL-DATA")) return;

    let filteredLessons = cache.get("ALL-DATA");

    // Lọc theo lessonSearch
    if (lessonSearch.trim() !== "") {
      filteredLessons = filteredLessons.filter((lesson) =>
        lesson.lessonName
          .toLowerCase()
          .includes(lessonSearch.trim().toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredLessons = filteredLessons.filter((lesson) => lesson.deleted);
    } else if (statusFilter === "Active") {
      filteredLessons = filteredLessons.filter((lesson) => !lesson.deleted);
    }

    // Lọc theo Course Id
    if (courseIdFilter !== "All") {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.courseId === Number(courseIdFilter)
      );
    }

    // Phân trang
    const startIndex = currentPage * lessonsPerPage;
    const endIndex = startIndex + lessonsPerPage;
    const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

    setLessons(paginatedLessons.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredLessons.length / lessonsPerPage));
    setLoading(false);
  }, [cache, statusFilter, courseIdFilter, currentPage, lessonSearch]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchLessons();
  }, [cache, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const cacheKey = `${lessonSearch.trim()}-${statusFilter}-${courseIdFilter}`;

      let fetchedLessons;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedLessons = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getLessonByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedLessons = data.data.content;

        // Lọc theo lessonSearch
        if (lessonSearch.trim() !== "") {
          fetchedLessons = fetchedLessons.filter((lesson) =>
            lesson.lessonName
              .toLowerCase()
              .includes(lessonSearch.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-DATA";
        if (!cache.has(ALL_KEY)) {
          const data = await getLessonByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allLessons = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allLessons));
          setCache(newCache);
          localStorage.setItem(
            "lessonCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedLessons = fetchedLessons.filter((lesson) => lesson.deleted);
        } else if (statusFilter === "Active") {
          fetchedLessons = fetchedLessons.filter((lesson) => !lesson.deleted);
        }

        const newCache = new Map(cache.set(cacheKey, fetchedLessons));
        setCache(newCache);
        localStorage.setItem(
          "lessonCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedLessons.length === 0 && lessonSearch.trim() !== "") {
        toast.info("No lessons found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
      const startIndex = currentPage * lessonsPerPage;
      const endIndex = startIndex + lessonsPerPage;
      const paginatedLessons = fetchedLessons.slice(startIndex, endIndex);

      setLessons(paginatedLessons.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedLessons.length / lessonsPerPage));
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của lessonSearch, filterType, và statusFilter vào localStorage**
  useEffect(() => {
    localStorage.setItem("lessonSearch", lessonSearch);
    localStorage.setItem("statusFilter", statusFilter);
    localStorage.setItem("courseIdFilter", courseIdFilter);
  }, [lessonSearch, statusFilter, courseIdFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("lessonCache");
    const savedNewLessons = localStorage.getItem("newLessons");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewLessons) {
        const newLessons = JSON.parse(savedNewLessons);
        const key = `${lessonSearch.trim()}-${statusFilter}-${courseIdFilter}`;

        const updatedLessons = [...(parsedCache.get(key) || []), ...newLessons];
        parsedCache.set(key, updatedLessons);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "lessonCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa lessons mới đã dùng
        localStorage.removeItem("newLessons");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("lesson")) {
      setLessonSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  const handleSearchInput = (e) => {
    setLessonSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLessons();
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete lesson "${name}"?`
    );
    if (isConfirmed) {
      try {
        await deleteLesson(id);
        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("lessonCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));

          // Cập nhật ALL-DATA
          const allData = parsedCache.get("ALL-DATA") || [];
          const updatedAllData = allData.map((lesson) =>
            lesson.id === id ? { ...lesson, deleted: true } : lesson
          );
          parsedCache.set("ALL-DATA", updatedAllData);

          // Cập nhật cache hiện tại (dựa vào các filter)
          const currentKey = `${lessonSearch.trim()}-${statusFilter}-${courseIdFilter}`;
          if (parsedCache.has(currentKey)) {
            const currentList = parsedCache.get(currentKey);
            const updatedList = currentList.map((lesson) =>
              lesson.id === id ? { ...lesson, deleted: true } : lesson
            );
            parsedCache.set(currentKey, updatedList);
          }

          localStorage.setItem(
            "lessonCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các useEffect khác reload
        window.dispatchEvent(new Event("triggerLessonReload"));

        toast.success("Lesson deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error deleting lesson:", error);
        toast.error("Failed to delete lesson!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore lesson "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreLesson(id);

        // ✅ Cập nhật courseCache trong localStorage nếu có
        const savedCache = localStorage.getItem("lessonCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));

          // Cập nhật ALL-DATA
          const allData = parsedCache.get("ALL-DATA") || [];
          const updatedAllData = allData.map((lesson) =>
            lesson.id === id ? { ...lesson, deleted: false } : lesson
          );
          parsedCache.set("ALL-DATA", updatedAllData);

          // Cập nhật cache hiện tại (dựa vào các filter)
          const currentKey = `${lessonSearch.trim()}-${statusFilter}-${courseIdFilter}`;
          if (parsedCache.has(currentKey)) {
            const currentList = parsedCache.get(currentKey);
            const updatedList = currentList.map((lesson) =>
              lesson.id === id ? { ...lesson, deleted: false } : lesson
            );
            parsedCache.set(currentKey, updatedList);
          }

          localStorage.setItem(
            "lessonCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi sự kiện để các component khác reload nếu cần
        window.dispatchEvent(new Event("triggerLessonReload"));

        toast.success("Lesson restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error restoring lesson:", error);
        toast.error("Failed to restore lesson!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="h-full dark:border-darkBorder dark:border bg-wcolor drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <Link
            className="flex items-center mx-2 gap-2 dark:text-darkText"
            onClick={() => navigate(-1)}
          >
            <FaVideo size={isMobile ? 60 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-5xl lg:text-lg font-bold">
              {t("addLesson.main")}
            </h2>
          </Link>
          <Link className="hover:text-ficolor" to={`/admin/lessons/add`}>
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <div className="relative h-24 lg:h-12 w-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full h- px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              onChange={handleSearchInput}
            />
            {lessonSearch && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setLessonSearch("");
                }}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>

          <select
            value={courseIdFilter}
            onChange={(e) => {
              setCurrentPage(0);
              setCourseIdFilter(e.target.value);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-48"
          >
            <option value="All">{t("all")}</option>
            {courseList.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Deleted">{t("deleted")}</option>
            <option value="Active">{t("active")}</option>
          </select>
          <button
            type="submit"
            className="bg-wcolor lg:text-base text-3xl hover:bg-tcolor dark:hover:bg-darkHover dark:bg-darkSubbackground dark:border-darkBorder border-2 whitespace-nowrap px-4 py-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        {/* Danh sách bài học + Pagination dưới bảng */}
        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 px-4 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead>
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("lesson.name")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("courseName")}</th>
                  <th className="p-2">{t("createdDate")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={8} />
                ) : lessons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {t("lesson.noLesson")}
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson, index) => (
                    <tr
                      key={lesson.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * lessonsPerPage}
                      </td>

                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {lesson.lessonName?.length > 20
                          ? lesson.lessonName.slice(0, 20) + "..."
                          : lesson.lessonName || "N/A"}
                      </td>

                      <td className="p-2 lg:w-72 whitespace-nowrap">
                        {lesson.description
                          ? lesson.description.slice(0, 25) +
                            (lesson.description.length > 25 ? "..." : "")
                          : "No description"}
                      </td>

                      <td className="p-2 text-center lg:w-48 whitespace-nowrap">
                        {lesson.courseName?.length > 20
                          ? lesson.courseName.slice(0, 20) + "..."
                          : lesson.courseName || "N/A"}
                      </td>

                      <td className="p-2 lg:w-32 whitespace-nowrap">
                        {lesson.date
                          ? new Date(
                              lesson.date[0],
                              lesson.date[1] - 1,
                              lesson.date[2],
                              lesson.date[3],
                              lesson.date[4],
                              lesson.date[5]
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="p-2 w-40">
                        {lesson.deleted ? (
                          <p className="text-red-600 font-semibold">
                            {t("deleted")}
                          </p>
                        ) : (
                          <p className="text-green-600 font-semibold">
                            {t("active")}
                          </p>
                        )}
                      </td>

                      <td className="px-2 h-full items-center flex flex-1 justify-center gap-1">
                        <Link
                          to={`/admin/lessons/${lesson.id}/quizzes`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-indigo-500 hover:bg-indigo-400 text-white"
                        >
                          <FaArrowRight />
                        </Link>

                        <Link
                          to={`/view-lesson-detail/${lesson.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-500 hover:bg-green-400 text-white"
                        >
                          <FaEye />
                        </Link>

                        <Link
                          to={`/admin/lessons/edit/${lesson.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                        >
                          <FaEdit />
                        </Link>

                        {lesson.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() =>
                              handleRestore(lesson.id, lesson.lessonName)
                            }
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            onClick={() =>
                              handleDelete(lesson.id, lesson.lessonName)
                            }
                            title="Khóa bài học"
                          >
                            <FaLock />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination gắn liền bên dưới */}
        <div className="flex dark:text-darkText lg:text-base text-3xl pt-2 items-center justify-between">
          <p className="mx-2">
            {loading
              ? t("Loading") // Hiển thị "Loading..." nếu đang tải
              : `${t("page")} ${currentPage + 1} ${t("of")} ${totalPages}`}{" "}
            {/* Nếu không phải loading, hiển thị thông tin page */}{" "}
          </p>
          <div className="space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0 || loading}
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateBefore size={isMobile ? 55 : 30} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateNext size={isMobile ? 55 : 30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
