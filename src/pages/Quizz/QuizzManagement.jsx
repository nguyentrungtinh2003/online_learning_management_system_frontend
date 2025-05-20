import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import {
  FaBuffer,
  FaEdit,
  FaEye,
  FaPlus,
  FaTimes,
  FaCoins,
  FaArrowRight,
} from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getQuizzesByPage,
  deleteQuiz,
  restoreQuiz,
  searchQuiz,
} from "../../services/quizapi";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const QuizzManagement = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [quizSearch, setQuizSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const quizzesPerPage = 6;
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [quizCache, setquizCache] = useState(new Map());
  const [lessonIdFilter, setLessonIdFilter] = useState("All");

  const stored = localStorage.getItem("lessonCache");
  const lessonMap = stored ? new Map(JSON.parse(stored)) : new Map();

  // Lấy danh sách bài học tổng hợp (dùng trong Lesson)
  const lessonList = lessonMap.get("ALL-LESSONS") || [];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const selectedLesson = lessonList.find(
    (c) => String(c.id) === String(lessonIdFilter)
  );

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("quizSearch");
    const savedStatusFilter = localStorage.getItem("statusFilter");
    const savedFilterType = localStorage.getItem("filterType");
    const savedLessonFilter = localStorage.getItem("quizLessonIdFilter");

    if (savedSearch) setLessonSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
    if (savedFilterType) setLessonIdFilter(savedFilterType);
    if (savedLessonFilter) setLessonIdFilter(savedLessonFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerLLessonReload**
  useEffect(() => {
    const handleReload = () => {
      triggerReload(); // Gọi trigger để re-fetch cache và lesson
    };
    window.addEventListener("triggerQuizReload", handleReload);

    return () => {
      window.removeEventListener("triggerQuizReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // Effect 3: Lọc quiz và phân trang
  useEffect(() => {
    if (!quizCache.has("ALL-QUIZZES")) return;

    let filteredQuizzes = quizCache.get("ALL-QUIZZES");

    // Lọc theo quizSearch
    if (quizSearch.trim() !== "") {
      filteredQuizzes = filteredQuizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(quizSearch.trim().toLowerCase())
      );
    }

    // Lọc theo giá
    if (filterType === "Free") {
      filteredQuizzes = filteredQuizzes.filter(
        (quiz) => quiz.price === 0 || quiz.price === null
      );
    } else if (filterType === "Paid") {
      filteredQuizzes = filteredQuizzes.filter(
        (quiz) => quiz.price !== null && quiz.price > 0
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredQuizzes = filteredQuizzes.filter((quiz) => quiz.deleted);
    } else if (statusFilter === "Active") {
      filteredQuizzes = filteredQuizzes.filter((quiz) => !quiz.deleted);
    }

    // Lọc theo Lesson Id
    if (lessonIdFilter !== "All") {
      filteredQuizzes = filteredQuizzes.filter(
        (quiz) => quiz.lessonId === parseInt(lessonIdFilter)
      );
    }

    // Phân trang
    const startIndex = currentPage * quizzesPerPage;
    const endIndex = startIndex + quizzesPerPage;
    const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

    setQuizzes(paginatedQuizzes.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredQuizzes.length / quizzesPerPage));
    setLoading(false);
  }, [
    quizCache,
    quizSearch,
    filterType,
    statusFilter,
    lessonIdFilter,
    currentPage,
  ]);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch quizzes from API or cache**
  useEffect(() => {
    fetchQuizzes();
  }, [quizCache, currentPage, reloadTrigger]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const cacheKey = `${quizSearch.trim()}-${filterType}-${statusFilter}-${lessonIdFilter}`;

      let fetchedQuizzes;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (quizCache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedQuizzes = quizCache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getQuizzesByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedQuizzes = data.data.content;

        // Lọc theo lessonSearch
        if (quizSearch.trim() !== "") {
          fetchedQuizzes = fetchedQuizzes.filter((quiz) =>
            quiz.quizName
              .toLowerCase()
              .includes(quizSearch.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-QUIZZES";
        if (!quizCache.has(ALL_KEY)) {
          const data = await getQuizzesByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allQuizzes = data.data.content;

          const newCache = new Map(quizCache.set(ALL_KEY, allQuizzes));
          setquizCache(newCache);
          localStorage.setItem(
            "quizCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo giá
        if (filterType === "Free") {
          fetchedQuizzes = fetchedQuizzes.filter(
            (quiz) => quiz.price === 0 || quiz.price === null
          );
        } else if (filterType === "Paid") {
          fetchedQuizzes = fetchedQuizzes.filter(
            (quiz) => quiz.price !== null && quiz.price > 0
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedQuizzes = fetchedQuizzes.filter((quiz) => quiz.deleted);
        } else if (statusFilter === "Active") {
          fetchedQuizzes = fetchedQuizzes.filter((quiz) => !quiz.deleted);
        }

        const newCache = new Map(quizCache.set(cacheKey, fetchedQuizzes));
        setquizCache(newCache);
        localStorage.setItem(
          "quizCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedQuizzes.length === 0 && quizSearch.trim() !== "") {
        toast.info("No quizzes found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
      const startIndex = currentPage * quizzesPerPage;
      const endIndex = startIndex + quizzesPerPage;
      const paginatedQuizzes = fetchedQuizzes.slice(startIndex, endIndex);

      setQuizzes(paginatedQuizzes.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedQuizzes.length / quizzesPerPage));
    } catch (error) {
      console.error("Lỗi tải quiz:", error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("quizSearch", quizSearch);
    localStorage.setItem("filterType", filterType);
    localStorage.setItem("statusFilter", statusFilter);
    localStorage.setItem("quizLessonIdFilter", lessonIdFilter);
  }, [quizSearch, filterType, statusFilter, lessonIdFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("quizCache");
    const savedNewQuizzes = localStorage.getItem("newQuizzes");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewQuizzes) {
        const newQuizzes = JSON.parse(savedNewQuizzes);
        const key = `${quizSearch.trim()}-${filterType}-${lessonIdFilter}`;

        const updatedQuizzes = [...(parsedCache.get(key) || []), ...newQuizzes];
        parsedCache.set(key, updatedQuizzes);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "quizCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newQuizzes");
      }

      setquizCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (!location.pathname.includes("quiz")) {
      setQuizSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  // ---------------------------------------------------------------------------------------------------
  // Handle Search Input Change
  const handleSearchInput = (e) => {
    setQuizSearch(e.target.value);
    setCurrentPage(0); // Reset to first page when search changes
  };

  // ---------------------------------------------------------------------------------------------------
  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuizzes();
  };

  // ---------------------------------------------------------------------------------------------------
  // Handle Delete
  const handleDelete = async (id, name) => {
    // ✅ Sửa lỗi confirm với template string
    const isConfirmed = window.confirm(
      `Are you sure you want to delete quiz "${name}"?`
    );
    if (isConfirmed) {
      try {
        await deleteQuiz(id);

        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("quizCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc tùy theo bộ lọc hiện tại
          const existingQuizzes = parsedCache.get(key) || [];

          const updatedQuizzes = existingQuizzes.filter(
            (quiz) => quiz.id !== id
          );
          parsedCache.set(key, updatedQuizzes);

          localStorage.setItem(
            "quizCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các useEffect khác reload
        window.dispatchEvent(new Event("triggerQuizReload"));

        toast.success("Quiz deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
        toast.error("Failed to delete quiz!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // Handle Restore
  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore quiz "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreQuiz(id);

        // ✅ Cập nhật courseCache trong localStorage nếu có
        const savedCache = localStorage.getItem("quizCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc tùy theo bộ lọc hiện tại

          const existingQuizzes = parsedCache.get(key) || [];

          const updatedQuizzes = existingQuizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, deleted: false } : quiz
          );

          parsedCache.set(key, updatedQuizzes);

          localStorage.setItem(
            "quizCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi sự kiện để các component khác reload nếu cần
        window.dispatchEvent(new Event("triggerQuizReload"));

        toast.success("Quiz restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchQuizzes(); // Reload quiz list
      } catch (error) {
        console.error("Error restoring quiz:", error);
        toast.error("Failed to restore quiz!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // Handle Pagination
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrePage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <FaBuffer size={isMobile ? 60 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-5xl lg:text-lg font-bold">{t("quizz.title")}</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/quizzes/add">
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30}/>
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <div className="relative h-24 lg:h-12 w-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full h- px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              value={quizSearch}
              onChange={handleSearchInput}
            />
            {quizSearch && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setQuizSearch("");
                }}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>

          <select
            value={lessonIdFilter}
            onChange={(e) => {
              setCurrentPage(0);
              setLessonIdFilter(e.target.value);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-40"
          >
            <option value="All">{t("all")}</option>
            {lessonList.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lessonName}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Free">{t("free")}</option>
            <option value="Paid">{t("paid")}</option>
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

        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 px-4 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("quizz.name")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("price")}</th>
                  <th className="p-2">{t("lesson.name")}</th>
                  <th className="p-2">{t("quizz.date")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={5} />
                ) : quizzes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {t("quizz.noQuiz")}
                    </td>
                  </tr>
                ) : (
                  quizzes.map((quiz, index) => (
                    <tr key={quiz.id} className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover">
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * quizzesPerPage}
                      </td>

                      <td className="p-2 lg:w-44 whitespace-nowrap">
                        {quiz.quizName?.length > 20
                          ? quiz.quizName.slice(0, 20) + "..."
                          : quiz.quizName || "N/A"}
                      </td>

                      <td className="p-2 lg:w-60 whitespace-nowrap">
                        {quiz.description
                          ? quiz.description.replace(/<[^>]+>/g, "").slice(0, 25) + (quiz.description.length > 25 ? "..." : "")
                          : "No description"}
                      </td>

                      <td className="p-2 lg:w-32 whitespace-nowrap">
                        {quiz.price === 0 || quiz.price === null ? (
                          <p className="text-green-600 font-semibold">{t("free")}</p>
                        ) : (
                          <span>
                            {quiz.price}{" "}
                            <FaCoins
                              size={20}
                              className="inline-block ml-1 text-yellow-500"
                            />
                          </span>
                        )}
                      </td>

                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {quiz.lessonName?.length > 20
                          ? quiz.lessonName.slice(0, 20) + "..."
                          : quiz.lessonName || "No quiz"}
                      </td>

                      <td className="p-2 lg:w-32 whitespace-nowrap">
                        {quiz.date
                          ? new Date(
                              quiz.date[0],
                              quiz.date[1] - 1,
                              quiz.date[2],
                              quiz.date[3],
                              quiz.date[4],
                              quiz.date[5]
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="p-2 lg:w-32 whitespace-nowrap">
                        {quiz.deleted ? "Deleted" : "Active"}
                      </td>

                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <Link
                          to={`/admin/quizzes/${quiz.id}/questions`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-indigo-500 hover:bg-indigo-400 text-white"
                          title="Xem danh sách câu hỏi"
                        >
                          <FaArrowRight />
                        </Link>

                        <Link
                          to={`/view-quiz-detail/${quiz.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-500 hover:bg-green-400 text-white"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Link>

                        <Link
                          to={`/admin/quizzes/${quiz.id}/edit`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>

                        {quiz.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() => handleRestore(quiz.id, quiz.quizName)}
                            title="Khôi phục bài kiểm tra"
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            onClick={() => handleDelete(quiz.id, quiz.quizName)}
                            title="Khóa bài kiểm tra"
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

        <div className="flex lg:text-base text-3xl pt-2 items-center justify-between">
          <p className="mx-2">
            {loading
              ? t("Loading") // Hiển thị "Loading..." nếu đang tải
              : `${t("page")} ${currentPage + 1} ${t("of")} ${totalPages}`}{" "}
            {/* Nếu không phải loading, hiển thị thông tin page */}
          </p>
          <div className="space-x-2">
            <button
             className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handlePrePage}
              disabled={currentPage === 0 || loading}
            >
              <MdNavigateBefore size={isMobile ? 55 : 30} />
            </button>
            <button
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1 || loading}
            >
              <MdNavigateNext size={isMobile ? 55 : 30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzManagement;
