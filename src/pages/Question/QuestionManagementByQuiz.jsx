import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { FaUsers, FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";
import {
  getQuestionByPage,
  searchQuestion,
  deleteQuestion,
  getQuestionByQuizIdAndPage,
} from "../../services/questionapi";
import { useTranslation } from "react-i18next";

const QuestionManagement = () => {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const { quizId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const questionPerPage = 6;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        console.log(
          `Fetching questions: Page${currentPage}, PerPage=${questionPerPage}`
        );
        const data = await getQuestionByQuizIdAndPage(
          quizId,
          currentPage,
          questionPerPage
        );
        console.log("API Response:", data);
        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }
        setQuestions(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải câu hỏi:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [currentPage]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setCurrentPage(0); // Reset về trang đầu tiên nếu xóa từ khóa
      return;
    }
    setLoading(true);
    try {
      const data = await searchQuestion(
        e.target.value,
        currentPage,
        questionPerPage
      );
      searchQuestion(data.data.content);
      setTotalPages(data.data.totalPages);
      setTotalPages(data.data.totalPages);
      setCurrentPage(0); // Đảm bảo về trang đầu tiên sau khi search
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      searchQuestion([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa quiz "${name}" không?`
    );
    if (isConfirmed) {
      try {
        const response = await deleteQuestion(id);
        console.log("Delete API", response);

        // Gọi API phân trang thay vì getCourses()
        const data = await getQuestionByPage(currentPage, questionPerPage);
        setQuestions(data.data.content);
        setTotalPages(data.data.totalPages);

        toast.success("Xóa question thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Lỗi khi xóa question:", error);
        toast.error("Không thể xóa question", {
          position: "top-right",
          autoClose: 3000,
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
          <Link className="flex items-center mx-2 gap-2 dark:text-darkText" onClick={() => navigate(-1)}>
            <MdNavigateBefore size={isMobile ? 60 : 30} />
            <h2 className="text-lg font-bold">Back</h2>
          </Link>
          <Link
            className="hover:text-ficolor"
            to={`/admin/quizzes/${quizId}/questions/add`}
          >
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative mb-2 h-24 lg:h-12 w-full">
          <input
            type="text"
            placeholder="Search question..."
            className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full h- px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 px-4 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            {loading ? (
              <p className="text-center">Loading question...</p>
            ) : (
              <div className="h-full">
                <table className="lg:w-full w-[200%] h-fit">
                  <thead>
                    <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-6xl dark:text-darkText whitespace-nowrap font-bold">
                      <th className="p-2">ID</th>
                      <th className="p-2">Question Name</th>
                      <th className="p-2">Question A</th>
                      <th className="p-2">Question B</th>
                      <th className="p-2">Question C</th>
                      <th className="p-2">Question D</th>
                      <th className="p-2">Correct Answer</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(6)].map((_, index) => (
                        <tr key={index} className="text-center">
                          {Array(10)
                            .fill(null)
                            .map((_, i) => (
                              <td key={i} className="p-2">
                                <div className="h-8 w-full dark:text my-1 bg-gray-300 rounded mx-auto"></div>
                              </td>
                            ))}
                        </tr>
                      ))
                    ) : questions.length > 0 ? (
                      questions.map((question, index) => (
                        <tr key={question.id} className="text-center dark:border-darkBorder text-6xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover">
                          <td className="p-2 lg:h-[8vh] h-[11vh]">
                            {index + 1 + currentPage * questionPerPage}
                          </td>
                          <td className="p-2 h-[11vh]">{question.questionName}</td>
                          <td className="p-2">{question.answerA}</td>
                          <td className="p-2">{question.answerB}</td>
                          <td className="p-2">{question.answerC}</td>
                          <td className="p-2">{question.answerD}</td>
                          <td className="p-2">{question.answerCorrect}</td>
                          <td className="p-2">
                            {question.img ? (
                              <img
                                src={question.img}
                                alt="question"
                                className="w-10 h-10 object-cover rounded mx-auto"
                              />
                            ) : (
                              "No image"
                            )}
                          </td>
                          <td className="px-2 h-full items-center flex flex-1 justify-center gap-1">
                            <Link className="p-2 border rounded">
                              <FaEye />
                            </Link>
                            <Link
                              to={`/admin/quizzes/${quizId}/questions/edit/${question.id}`}
                              className="p-2 border rounded"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="p-2 border rounded"
                              onClick={() =>
                                handleDelete(question.id, question.questionName)
                              }
                            >
                              <MdDeleteForever />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center p-4">
                          No questions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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
              <MdNavigateNext size={isMobile ? 55 : 30}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;
