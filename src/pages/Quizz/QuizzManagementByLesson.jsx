import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { FaBuffer, FaEdit, FaEye, FaPlus,FaLock,FaLockOpen,FaArrowRight } from "react-icons/fa";
import { MdNavigateNext, MdDeleteForever, MdNavigateBefore } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuizzesByLessonIdAndPage,restoreQuiz, deleteQuiz } from "../../services/quizapi";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { useTranslation } from "react-i18next";

const QuizzManagement = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const quizzesPerPage = 6;

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, search, filterType, currentPage]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getQuizzesByLessonIdAndPage(lessonId, 0, 1000); // lấy toàn bộ quiz của bài học
  
      if (!res || !res.data || !res.data.content) {
        throw new Error("Invalid API Response");
      }
  
      let fetchedQuizzes = res.data.content;
  
      // Tìm kiếm
      if (search.trim() !== "") {
        fetchedQuizzes = fetchedQuizzes.filter((quiz) =>
          quiz.title.toLowerCase().includes(search.trim().toLowerCase())
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuizzes();
  };

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
            <h2 className="text-lg font-bold">{t("quizz.title")}</h2>
          </div>
          <Link to={`/admin/lessons/${lessonId}/quizzes/add`}>
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30}/>
            </button>
          </Link>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchQuizzes(); }} className=" mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Search quizzes..."
            className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full h- px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
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
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Free">{t("free")}</option>
            <option value="Paid">{t("paid")}</option>
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
              <thead>
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("quizz.name")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("price")}</th>
                  <th className="p-2">{t("image")}</th>
                  <th className="p-2">{t("createdDate")}</th>
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
                      <td className="p-2 lg:h-[8vh] h-[11vh]">{index + 1 + currentPage * quizzesPerPage}</td>
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
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={isMobile ? 55 : 30} />
            </button>
            <button
             className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
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
