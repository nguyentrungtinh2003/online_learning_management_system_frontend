import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
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
  const [cache, setCache] = useState(new Map());

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("quizSearch");
    const savedStatusFilter = localStorage.getItem("statusFilter");

    if (savedSearch) setQuizSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerQuizReload**
  useEffect(() => {
    const handleReload = () => {
      fetchQuizzes(); // Gọi trigger để re-fetch quizzes
    };
    window.addEventListener("triggerQuizReload", handleReload);

    return () => {
      window.removeEventListener("triggerQuizReload", handleReload);
    };
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // Effect 3: Lọc quiz và phân trang
  useEffect(() => {
    if (!cache.has("ALL-QUIZZES")) return;

    let filteredQuizzes = cache.get("ALL-QUIZZES");

    // Lọc theo quizSearch
    if (quizSearch.trim() !== "") {
      filteredQuizzes = filteredQuizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(quizSearch.trim().toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredQuizzes = filteredQuizzes.filter((quiz) => quiz.deleted);
    } else if (statusFilter === "Active") {
      filteredQuizzes = filteredQuizzes.filter((quiz) => !quiz.deleted);
    }

    // Phân trang
    const startIndex = currentPage * quizzesPerPage;
    const endIndex = startIndex + quizzesPerPage;
    const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

    setQuizzes(paginatedQuizzes.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredQuizzes.length / quizzesPerPage));
    setLoading(false);
  }, [cache, statusFilter, currentPage]);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch quizzes from API or cache**
  useEffect(() => {
    fetchQuizzes();
  }, [cache, filterType, statusFilter, currentPage, reloadTrigger]);

  // ---------------------------------------------------------------------------------------------------
  // Fetch quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const cacheKey = `${quizSearch.trim()}-${filterType}-${statusFilter}`;

      let fetchedQuizzes;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedQuizzes = cache.get(cacheKey);
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
        if (!cache.has(ALL_KEY)) {
          const data = await getQuizzesByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allQuizzes = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allQuizzes));
          setCache(newCache);
          localStorage.setItem(
            "quizCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedQuizzes = fetchedQuizzes.filter((quiz) => quiz.deleted);
        } else if (statusFilter === "Active") {
          fetchedQuizzes = fetchedQuizzes.filter((quiz) => !quiz.deleted);
        }

        const newCache = new Map(cache.set(cacheKey, fetchedQuizzes));
        setCache(newCache);
        localStorage.setItem(
          "quizCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedQuizzes.length === 0 && fetchedQuizzes.trim() !== "") {
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
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa quiz "${name}" không?`
    );
    if (isConfirmed) {
      try {
        await deleteQuiz(id);
        toast.success("Xóa quiz thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchQuizzes();
      } catch (error) {
        console.error("Lỗi khi xóa quiz:", error);
        toast.error("Không thể xóa quiz!", {
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
      `Bạn có chắc muốn khôi phục quiz "${name}" không?`
    );
    if (isConfirmed) {
      try {
        await restoreQuiz(id);
        toast.success("Khôi phục quiz thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchQuizzes(); // Reload quiz list
      } catch (error) {
        console.error("Lỗi khi khôi phục quiz:", error);
        toast.error("Không thể khôi phục quiz!", {
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
    <div className="h-full w-full dark:text-darkText">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 dark:text-darkText items-center">
            <FaBuffer size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold">{t("quizz.title")}</h2>
          </div>
          <Link to={`/admin/quizzes/add`}>
            <button className="cursor-pointer bg-fcolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} color="white" />
            </button>
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchQuizzes();
          }}
          className="mb-2 flex gap-2"
        >
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded w-full focus:outline-none"
            value={quizSearch}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Free">{t("free")}</option>
            <option value="Paid">{t("paid")}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0); // Reset page when status filter changes
            }}
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Deleted">{t("deleted")}</option>
            <option value="Active">{t("active")}</option>
          </select>
          <button
            type="submit"
            className="bg-fcolor whitespace-nowrap text-white p-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-wcolor border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="text-center dark:text-darkText font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("quizz.name")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("price")}</th>
                  <th className="p-2">{t("image")}</th>
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
                    <tr key={quiz.id} className="text-center">
                      <td className="p-2">
                        {index + 1 + currentPage * quizzesPerPage}
                      </td>
                      <td className="p-2">{quiz.quizName || "N/A"}</td>
                      <td className="p-2">{quiz.description || "N/A"}</td>
                      <td className="p-2">
                        {quiz.price === 0 || quiz.price === null ? (
                          <p>{t("free")}</p>
                        ) : (
                          `${quiz.price} Coin`
                        )}
                      </td>
                      <td className="p-2">
                        {quiz.img ? (
                          <img
                            src={quiz.img}
                            alt="quiz"
                            className="w-8 h-8 rounded mx-auto"
                          />
                        ) : (
                          <p>{t("quizz.noImage")}</p>
                        )}
                      </td>
                      <td className="p-2">
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
                      <td className="p-2">
                        {quiz.deleted ? (
                          <p>{t("unlock")}</p>
                        ) : (
                          <p>{t("lock")}</p>
                        )}
                      </td>
                      <td className="p-2 flex justify-center gap-1">
                        <Link
                          to={`/admin/quizzes/${quiz.id}/questions`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          // to={`/admin/lessons/${lessonId}/edit/${quiz.id}`}
                          className="p-2 border rounded"
                        >
                          <FaEdit />
                        </Link>
                        {quiz.deleted ? (
                          <button
                            className="p-2 border rounded"
                            onClick={() =>
                              handleRestore(quiz.id, quiz.quizName)
                            }
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border rounded"
                            onClick={() => handleDelete(quiz.id, quiz.quizName)}
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

        <div className="flex mt-2 justify-between items-center">
          <p>
            {t("page")} {currentPage + 1} {t("of")} {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-scolor p-1 rounded disabled:opacity-50"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              className="bg-scolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QuizzManagement;
