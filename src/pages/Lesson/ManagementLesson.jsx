import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import {
  FaBuffer,
  FaEdit,
  FaEye,
  FaPlus,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import {
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLesson,
  getLessonByPage,
  restoreLesson,
} from "../../services/lessonapi";
import { useTranslation } from "react-i18next";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";

export default function ManagementLesson() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const lessonsPerPage = 6;

  const fetchLessons = async () => {
    setLoading(true);
    try {
      let data = await getLessonByPage(0, 1000);
      if (!data || !data.data || !data.data.content) {
        throw new Error("Invalid API Response");
      }

      let fetchedLessons = data.data.content;

      if (search.trim() !== "") {
        fetchedLessons = fetchedLessons.filter((lesson) =>
          lesson.lessonName.toLowerCase().includes(search.trim().toLowerCase())
        );
      }

      if (statusFilter === "Deleted") {
        fetchedLessons = fetchedLessons.filter((lesson) => lesson.deleted); // khóa
      } else if (statusFilter === "Active") {
        fetchedLessons = fetchedLessons.filter((lesson) => !lesson.deleted); // chưa khóa
      }

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

  useEffect(() => {
    fetchLessons();
  }, [currentPage, search, statusFilter]);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLessons();
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn khóa bài học "${name}" không?`
    );
    if (isConfirmed) {
      try {
        await deleteLesson(id);
        toast.success("Khóa bài học thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchLessons();
      } catch (error) {
        console.error("Lỗi khi khóa bài học:", error);
        toast.error("Không thể khóa bài học!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  const handleRestore = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn mở khóa bài học "${name}" không?`))
      return;

    try {
      await restoreLesson(id);
      toast.success("Mở khóa bài học thành công!", {
        position: "top-right",
        autoClose: 1000,
      });
      fetchLessons();
    } catch (error) {
      console.error("Lỗi khi mở khóa bài học:", error);
      toast.error("Không thể mở khóa bài học!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
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
