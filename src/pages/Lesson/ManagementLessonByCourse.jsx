import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FaBuffer, FaArrowRight, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  deleteLesson,
  getLessonByCourseIdAndPage,
  restoreLesson,
} from "../../services/lessonapi";
import { getCourseById } from "../../services/courseapi";
import { FaLockOpen, FaLock, FaTimes, FaCoins } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";

export default function ManagementLesson() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonByCourseSearch, setlessonByCourseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const lessonsPerPage = 6;
  const [cache, setCache] = useState(new Map());
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [courseName, setCourseName] = useState("Loading...");

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCourseName = async () => {
      const response = await getCourseById(courseId);
      if (response?.data?.courseName) {
        setCourseName(response.data.courseName);
      } else {
        setCourseName("N/A");
      }
    };

    if (courseId) {
      fetchCourseName();
    }
  }, [courseId]);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("lessonByCourseSearch");
    const savedStatusFilter = localStorage.getItem("statusFilter");

    if (savedSearch) setlessonByCourseSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerLLessonReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("lessonCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerLessonByCourseReload", handleReload);

    return () => {
      window.removeEventListener("triggerLessonByCourseReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // Effect 3: Lọc bài học từ cache và phân trang khi cache thay đổi
  useEffect(() => {
    if (!cache.has(`course-${courseId}-LESSONS`)) return;

    let filteredLessons = cache.get(`course-${courseId}-LESSONS`);

    // Lọc theo lessonByCourseSearch
    if (lessonByCourseSearch.trim() !== "") {
      filteredLessons = filteredLessons.filter((lesson) =>
        lesson.lessonName
          .toLowerCase()
          .includes(lessonByCourseSearch.trim().toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredLessons = filteredLessons.filter((lesson) => lesson.deleted);
    } else if (statusFilter === "Active") {
      filteredLessons = filteredLessons.filter((lesson) => !lesson.deleted);
    }

    // Phân trang
    const startIndex = currentPage * lessonsPerPage;
    const endIndex = startIndex + lessonsPerPage;
    const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

    setLessons(paginatedLessons.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredLessons.length / lessonsPerPage));
    setLoading(false);
  }, [cache, lessonByCourseSearch, statusFilter, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchLessons();
  }, [courseId, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const cacheKey = `${lessonByCourseSearch.trim()}-${statusFilter}-course-${courseId}`;

      let fetchedLessons;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedLessons = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getLessonByCourseIdAndPage(courseId, 0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedLessons = data.data.content;
        console.log("Fetch lesson by course : ", fetchedLessons);

        // Lọc theo lessonSearch
        if (lessonByCourseSearch.trim() !== "") {
          fetchedLessons = fetchedLessons.filter((lesson) =>
            lesson.lessonName
              .toLowerCase()
              .includes(lessonByCourseSearch.trim().toLowerCase())
          );
        }

        const ALL_KEY = `course-${courseId}-ALL-LESSONS`;
        if (!cache.has(ALL_KEY)) {
          const data = await getLessonByCourseIdAndPage(courseId, 0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allLessons = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allLessons));
          setCache(newCache);
          localStorage.setItem(
            "lessonByCourseCache",
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
          "lessonByCourseCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedLessons.length === 0 && lessonByCourseSearch.trim() !== "") {
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
      console.error("Lỗi tải bài học:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của lessonSearch, filterType, và statusFilter vào localStorage**
  useEffect(() => {
    localStorage.setItem("lessonByCourseSearch", lessonByCourseSearch);
    localStorage.setItem("statusFilter", statusFilter);
  }, [lessonByCourseSearch, statusFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("lessonByCourseCache");
    const savedNewLessons = localStorage.getItem("newLessonsByCourse");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewLessons) {
        const newLessonsByCourse = JSON.parse(savedNewLessons);
        const key = `${lessonByCourseSearch.trim()}-${statusFilter}-course-${courseId}`;

        const updatedLessons = [
          ...(parsedCache.get(key) || []),
          ...newLessonsByCourse,
        ];
        parsedCache.set(key, updatedLessons);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "lessonByCourseCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa lessons mới đã dùng
        localStorage.removeItem("newLessonsByCourse");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("lesson")) {
      setlessonByCourseSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  const handleSearchInput = (e) => {
    setlessonByCourseSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
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
        const savedCache = localStorage.getItem("lessonByCourseCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc tùy theo bộ lọc hiện tại
          const existingLessons = parsedCache.get(key) || [];

          const updatedLessons = existingLessons.filter(
            (lesson) => lesson.id !== id
          );
          parsedCache.set(key, updatedLessons);

          localStorage.setItem(
            "lessonByCourseCache",
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

        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("lessonByCourseCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc key phù hợp với filter hiện tại

          const existingLessons = parsedCache.get(key) || [];

          const updatedLessons = existingLessons.map((lesson) =>
            lesson.id === id ? { ...lesson, deleted: false } : lesson
          );

          parsedCache.set(key, updatedLessons);

          localStorage.setItem(
            "lessonByCourseCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các useEffect khác reload
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
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="h-full dark:border-darkBorder dark:border bg-wcolor drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <Link
            className="flex items-center mx-2 gap-2 dark:text-darkText"
            onClick={() => navigate(-1)}
          >
            <FaBuffer size={isMobile ? 50 : 30} />
            <MdNavigateBefore size={isMobile ? 60 : 30} />
            <h2 className="text-4xl lg:text-lg font-bold">{t("back")}</h2>
          </Link>
          <Link to={`/admin/courses/${courseId}/lessons/add`}>
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
              value={lessonByCourseSearch}
              onChange={handleSearchInput}
            />
            {lessonByCourseSearch && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setlessonByCourseSearch("");
                }}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-48"
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
              <thead className="sticky top-0 z-10 dark:text-darkText">
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

                      <td className="py-2 lg:w-56 whitespace-nowrap">
                        {lesson.description
                          ? stripHtml(lesson.description).slice(0, 25) +
                            (stripHtml(lesson.description).length > 20
                              ? "..."
                              : "")
                          : "No description"}
                      </td>

                      <td className="p-2 text-center lg:w-48 whitespace-nowrap">
                        {courseName.length > 20
                          ? courseName.slice(0, 20) + "..."
                          : courseName || "N/A"}
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
                          title="Xem danh sách liên quan"
                        >
                          <FaArrowRight />
                        </Link>

                        <Link
                          to={`/view-lesson-detail/${lesson.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-500 hover:bg-green-400 text-white"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Link>

                        <Link
                          to={`/admin/lessons/edit/${lesson.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>

                        {lesson.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() =>
                              handleRestore(lesson.id, lesson.lessonName)
                            }
                            title="Khôi phục bài học"
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
            {t("page")} {currentPage + 1} {t("of")} {totalPages}
          </p>
          <div className="space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
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
