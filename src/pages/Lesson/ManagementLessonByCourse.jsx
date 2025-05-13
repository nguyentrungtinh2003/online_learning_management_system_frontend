import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
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
      triggerReload(); // Gọi trigger để re-fetch cache và courses
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
    localStorage.setItem("lessonByCourseStatusFilter", statusFilter);
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

  return (
    <div className="h-full bg-wcolor drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <ToastContainer />
      <div className="w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <Link className="flex mx-2 gap-2 dark:text-darkText" onClick={() => navigate(-1)}>
            <FaBuffer size={30} />
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold">{t("back")}</h2>
          </Link>
          <Link to={`/admin/lessons/add`}>
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="py-2 px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
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
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Deleted">{t("deleted")}</option>
            <option value="Active">{t("active")}</option>
          </select>
          <button
            type="submit"
             className="bg-wcolor hover:bg-tcolor dark:hover:bg-darkHover dark:bg-darkSubbackground dark:border-darkBorder border-2 whitespace-nowrap px-4 py-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        {/* Danh sách bài học + Pagination dưới bảng */}
        <div className="flex-1 py-2">
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-y text-center dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("lesson.name")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("image")}</th>
                  <th className="p-2">{t("createdDate")}</th>
                  <th className="p-2">{t("lesson.videoURL")}</th>
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
                    <tr key={lesson.id} className="text-center border-b hover:bg-tcolor dark:hover:bg-darkHover">
                      <td className="p-2">
                        {index + 1 + currentPage * lessonsPerPage}
                      </td>
                      <td className="p-2">{lesson.lessonName || "N/A"}</td>
                      <td className="p-2">
                        {lesson.description || "No description"}
                      </td>
                      <td className="p-2">
                        {lesson.img ? (
                          <img
                            src={lesson.img}
                            alt="lesson"
                            className="w-8 h-8 rounded mx-auto"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td className="p-2">
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
                      <td className="p-2">
                        {lesson.videoURL ? (
                          <a
                            href={lesson.videoURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {t("viewVideo")}
                          </a>
                        ) : (
                          <>{t("noVideo")}</>
                        )}
                      </td>
                      <td className="p-2">
                        {lesson.deleted ? "Deleted" : "Active"}
                      </td>
                      <td className="p-2 flex justify-center gap-1">
                        <Link
                          to={`/admin/lessons/${lesson.id}/quizzes`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/lessons/edit/${lesson.id}`}
                          className="p-2 border rounded"
                        >
                          <FaEdit />
                        </Link>
                        {lesson.deleted ? (
                          <button
                            className="p-2 border rounded"
                            onClick={() =>
                              handleRestore(lesson.id, lesson.lessonName)
                            }
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border rounded"
                            onClick={() =>
                              handleDelete(lesson.id, lesson.lessonName)
                            }
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
        <div className="flex dark:text-darkText mt-2 items-center justify-between">
          <p className="mx-2">
            {loading
              ? t("Loading") // Hiển thị "Loading..." nếu đang tải
              : `${t("page")} ${currentPage + 1} ${t("of")} ${totalPages}`}{" "}
            {/* Nếu không phải loading, hiển thị thông tin page */}
          </p>
          <div className="space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
