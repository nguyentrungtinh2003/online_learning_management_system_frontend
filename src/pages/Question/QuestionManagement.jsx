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
        // console.log(`Fetching questions: Page${currentPage}, PerPage=${questionPerPage}`);
        const data = await getQuestionByPage(currentPage, questionPerPage);
        // console.log("API Response:", data);
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

  const handledNextPage = () => {
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
    <div className="h-full dark:border-darkBorder dark:border bg-wcolor drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <Link
            className="flex gap-2 items-center"
            onClick={() => navigate(-1)}
          >
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold">Back</h2>
          </Link>
          <Link className="hover:text-ficolor" to={`/admin/questions/add`}>
            <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

        {/* Ô tìm kiếm */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search question..."
            className="p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded w-full focus:outline-none"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-wcolor dark:border dark:text-darkSubtext dark:border-darkBorder dark:bg-darkSubbackground  p-4 rounded-2xl">
            {loading ? (
              <p className="text-center">Loading question...</p>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 z-10 dark:text-darkText">
                  <tr className="text-center lg:h-[5vh] h-[8vh] dark:text-darkText whitespace-nowrap font-bold">
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
                              <div className="h-8 w-full my-1 bg-gray-300 rounded mx-auto"></div>
                            </td>
                          ))}
                      </tr>
                    ))
                  ) : questions.length > 0 ? (
                    questions.map((question, index) => (
                      <tr
                        key={question.id}
                        className="text-center dark:text-darkSubtext"
                      >
                        <td className="p-2">
                          {index + 1 + currentPage * questionPerPage}
                        </td>
                        <td className="p-2">{question.questionName}</td>
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
                        <td className="p-2 flex justify-center gap-1">
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
            )}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <p>
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-scolor p-1 hover:scale-105 duration-500"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              className="bg-scolor p-1 hover:scale-105 duration-500"
              onClick={handledNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;
