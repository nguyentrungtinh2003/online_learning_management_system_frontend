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

const QuizzManagement = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const quizzesPerPage = 6;

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, search, filterType, statusFilter, currentPage]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getQuizzesByPage(currentPage, quizzesPerPage); // lấy toàn bộ quiz của bài học

      if (!res || !res.data || !res.data.content) {
        throw new Error("Invalid API Response");
      }

      let fetchedQuizzes = res.data.content;

      // Tìm kiếm
      if (search.trim() !== "") {
        const keyword = search.trim().toLowerCase();
        fetchedQuizzes = fetchedQuizzes.filter(
          (quiz) =>
            quiz.quizName?.toLowerCase().includes(keyword) ||
            quiz.description?.toLowerCase().includes(keyword)
        );
      }

      // Lọc theo loại Free / Paid
      if (filterType === "Free") {
        fetchedQuizzes = fetchedQuizzes.filter(
          (quiz) => quiz.price === 0 || quiz.price === null
        );
      } else if (filterType === "Paid") {
        fetchedQuizzes = fetchedQuizzes.filter(
          (quiz) => quiz.price !== null && quiz.price > 0
        );
      }

      // Filter by status (Deleted/Not Deleted)
      if (statusFilter === "Lock") {
        fetchedQuizzes = fetchedQuizzes.filter((quiz) => !quiz.deleted);
      } else if (statusFilter === "Unlock") {
        fetchedQuizzes = fetchedQuizzes.filter((quiz) => quiz.deleted);
      }

      // Phân trang
      const startIndex = currentPage * quizzesPerPage;
      const endIndex = startIndex + quizzesPerPage;
      const paginatedQuizzes = fetchedQuizzes.slice(startIndex, endIndex);

      setQuizzes(paginatedQuizzes.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedQuizzes.length / quizzesPerPage));
    } catch (err) {
      console.error("Lỗi lấy quiz:", err);
      setQuizzes([]);
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
    fetchQuizzes();
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa khóa học "${name}" không?`
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

  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore quiz "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreQuiz(id);
        toast.success("Course restored successfully!", {
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
            <h2 className="text-lg font-bold">Quizz Management</h2>
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
          className="mb-4 flex gap-2"
        >
          <input
            type="text"
            placeholder="Search quizzes..."
            className="p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded w-full focus:outline-none"
            value={search}
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
            <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0); // Reset page when status filter changes
            }}
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">All</option>
            <option value="Lock">Lock</option>
            <option value="Unlock">Unlock</option>
          </select>
          <button
            type="submit"
            className="bg-fcolor text-white p-2 rounded hover:scale-105"
          >
            Search
          </button>
        </form>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-wcolor border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="text-center dark:text-darkText font-bold">
                  <th className="p-2">STT</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={5} />
                ) : quizzes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Không có quiz nào
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
                        {quiz.price === 0 || quiz.price === null
                          ? "Free"
                          : `${quiz.price} VND`}
                      </td>
                      <td className="p-2">
                        {quiz.img ? (
                          <img
                            src={quiz.img}
                            alt="quiz"
                            className="w-8 h-8 rounded mx-auto"
                          />
                        ) : (
                          "No image"
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
                        {quiz.deleted ? "Unlock" : "Lock"}
                      </td>
                      <td className="p-2 flex justify-center gap-1">
                        <Link
                          to={`/admin/quizzes/${quiz.id}/questions`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/lessons/${lessonId}/edit/${quiz.id}`}
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

        <div className="flex justify-between mt-4">
          <p>
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-scolor text-wcolor p-1 hover:scale-105 duration-500"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              className="bg-scolor text-wcolor p-1 hover:scale-105 duration-500"
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
