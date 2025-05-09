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
  searchLessons,
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const lessonsPerPage = 6;

  useEffect(() => {
    fetchLessons();
  }, [courseId, currentPage, statusFilter, search]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const data = await getLessonByCourseIdAndPage(
        courseId,
        currentPage,
        lessonsPerPage
      );

      if (!data?.data?.content) throw new Error("Invalid API Response");

      let fetchedLessons = data.data.content;

      // Filter by status
      if (statusFilter === "Deleted") {
        fetchedLessons = fetchedLessons.filter((lesson) => lesson.deleted);
      } else if (statusFilter === "Active") {
        fetchedLessons = fetchedLessons.filter((lesson) => !lesson.deleted);
      }

      // Filter by search
      if (search.trim() !== "") {
        fetchedLessons = fetchedLessons.filter((lesson) =>
          lesson.name.toLowerCase().includes(search.trim().toLowerCase())
        );
      }

      if (fetchedLessons.length === 0 && search.trim() !== "") {
        toast.info("No lessons found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      setLessons(fetchedLessons.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedLessons.length / lessonsPerPage));
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // // Fetch lessons theo courseId
  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getLessonByCourseIdAndPage(
  //         courseId,
  //         currentPage,
  //         lessonsPerPage
  //       );
  //       if (!data?.data?.content) throw new Error("Invalid API Response");
  //       setLessons(data.data.content);
  //       setTotalPages(data.data.totalPages);
  //     } catch (error) {
  //       console.error("Lỗi tải bài học:", error);
  //       setLessons([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (courseId) fetchLessons();
  // }, [courseId, currentPage]);

  // Tìm kiếm bài học
  const handleSearch = async (e) => {
    const value = e.target.value; // Lưu giá trị trước khi setState
    setSearch(value);

    // Nếu người dùng xóa hết -> reset lại danh sách gốc
    if (value.trim() === "") {
      setCurrentPage(0);
      setLoading(true);
      try {
        const data = await getCoursesByPage(0, lessonsPerPage); // hoặc gọi API ban đầu
        setLessons(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải lại danh sách:", error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const data = await searchLessons(value, currentPage, lessonsPerPage);
      setLessons(data.data.content);
      setTotalPages(data.data.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchLessons();
  };

  // Xóa bài học
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài học "${name}" không?`))
      return;

    try {
      await deleteLesson(id);
      toast.success("Xóa bài học thành công!", {
        position: "top-right",
        autoClose: 1000,
      });
      fetchLessons();
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
      toast.error("Không thể xóa bài học!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore lesson "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreLesson(id);
        toast.success("Course restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchLessons();
      } catch (error) {
        console.error("Error restoring course:", error);
        toast.error("Failed to restore course!", {
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
    <div className="h-full w-full dark:text-darkText">
          <ToastContainer />
          <div className="w-full flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <Link className="flex gap-2" onClick={() => navigate(-1)}>
                <FaBuffer size={30} />
                <MdNavigateBefore size={30} />
                <h2 className="text-lg font-bold">{t("back")}</h2>
              </Link>
              <Link to={`/admin/lessons/add`}>
                <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
                  <FaPlus size={30} />
                </button>
              </Link>
            </div>
    
            <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="py-2 px-3 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
                value={search}
                onChange={handleSearchInput}
              />
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
                className="bg-fcolor whitespace-nowrap text-white px-4 py-2 rounded hover:scale-105"
              >
                {t("search")}
              </button>
            </form>
    
            {/* Danh sách bài học + Pagination dưới bảng */}
            <div className="flex-1 drop-shadow-lg">
              <div className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder p-4 rounded-2xl">
                <table className="w-full">
                      <thead>
                        <tr className="text-center whitespace-nowrap font-bold">
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
                          <tr key={lesson.id} className="text-center">
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
              <p>
              {t("page")} {currentPage + 1} {t("of")} {totalPages}
              </p>
              <div className="space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="bg-scolor p-1 rounded disabled:opacity-50"
              >
                <MdNavigateNext size={30} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="bg-scolor p-1 rounded disabled:opacity-50"
              >
                <MdNavigateNext size={30} />
              </button>
              </div>
            </div>
          </div>
    </div>
  );
}
