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
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";
import { getQuizzesByPage,searchQuiz,deleteQuiz } from "../../services/quizapi";

const QuizzManagement = () => {
  const navigate = useNavigate();

  const {lessonId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const quizzesPerPage = 6;

   useEffect(() => {
     const fetchQuizzes = async () => { 
       setLoading(true);
       try {
         console.log(`Fetching quizzes: Page${currentPage}, PerPage=${quizzesPerPage}`);
         const data = await getQuizzesByPage(currentPage, quizzesPerPage);
         console.log("API Response:", data);
         if(!data || !data.data || !data.data.content){
           throw new Error("Invalid API Response");
         }
         setQuizzes(data.data.content);
         setTotalPages(data.data.totalPages);
       } catch (error) {
         console.error("Lỗi tải bài học:", error);
         setQuizzes([]);
       } finally{
         setLoading(false);
       }
     };
     fetchQuizzes();
   }, [currentPage]);

      const handleSearch = async (e) => {
          setSearch(e.target.value);
          if(e.target.value.trim() === "") {
            setCurrentPage(0); // Reset về trang đầu tiên nếu xóa từ khóa
            return;
          }
          setLoading(true);
          try {
            const data = await searchQuiz(e.target.value,currentPage,quizzesPerPage);
            setQuizzes(data.data.content);
            setTotalPages(data.data.totalPages);
            setTotalPages(data.data.totalPages);
            setCurrentPage(0); // Đảm bảo về trang đầu tiên sau khi search
          }
          catch(error){
            console.error("Lỗi tìm kiếm:",error);
            setQuizzes([]);
          }
          finally {
            setLoading(false);
          }
        };


          const handleDelete = async (id, name) => {
            const isConfirmed = window.confirm(
              `Bạn có chắc muốn xóa quiz "${name}" không?`
            );
            if (isConfirmed) {
              try {
                const response = await deleteQuiz(id);
                console.log("Delete API", response);
          
                // Gọi API phân trang thay vì getCourses()
                const data = await getQuizzesByPage(currentPage, quizzesPerPage);
                setQuizzes(data.data.content);
                setTotalPages(data.data.totalPages);
          
                toast.success("Xóa quiz thành công!", {
                  position: "top-right",
                  autoClose: 3000,
                });
              } catch (error) {
                console.error("Lỗi khi xóa quiz:", error);
                toast.error("Không thể xóa quiz", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            }
          };

          const handledNextPage = () => {
            if(currentPage < totalPages - 1){
              setCurrentPage(currentPage+ 1);
            }
          };
        
          const handlePrePage = () => {
            if(currentPage > 0){
              setCurrentPage(currentPage-1);
            }
          };


           return (
              <div className="flex-1 h-screen">
                <div className="flex-1 flex flex-col h-full py-6 px-3">
                  <AdminNavbar />
                  <div className="flex justify-between mb-4">
                    <Link className="flex gap-2" onClick={() => navigate(-1)}>
                      <MdNavigateBefore size={30} />
                      <h2 className="text-lg font-bold mb-4">Back</h2>
                    </Link>
                    <Link
                      className="hover:text-ficolor"
                      to={`/admin/lessons/${lessonId}/quizzes/add`}
                      >
                      <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
                        <FaPlus size={30} />
                      </button>
                    </Link>
                  </div>
          
                     {/* Ô tìm kiếm */}
                     <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="p-2 border rounded w-full focus:outline-none"
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>
          
          
                  <div className="flex-1 drop-shadow-lg">
                    <div className="bg-white p-4 rounded-2xl">
                      {loading ? ( 
                        <p className="text-center">Loading quizzes...</p>
                      ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-center font-bold">
                            <th className="p-2">ID</th>
                            <th className="p-2">Quiz Name</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Image</th>
                            <th className="p-2">Created Date</th>
                            <th className="p-2">Deleted</th>
                            <th className="p-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                              <tr key={quiz.id} className="text-center">
                                <td className="p-2">{quiz.id}</td>
                                <td className="p-2">{quiz.quizName || "N/A"}</td>
                                <td className="p-2">
                                  {quiz.description || "No description"}
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
                                    ? new Date(quiz.date).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td className="p-2">
                                  {quiz.isDeleted ? "Active" : "Inactive"}
                                </td>
                                <td className="p-2 flex justify-center gap-1">
                                  <Link
                                    // to={`/admin/courses/${courseId}/lesson`}
                                    className="p-2 border rounded"
                                  >
                                    <FaEye />
                                  </Link>
                                  <Link
                                    // to={`/admin/courses/${courseId}/lessons/edit/${lesson.id}`}
                                    className="p-2 border rounded"
                                  >
                                    <FaEdit />
                                  </Link>
                                  {/* <button
                                    className="p-2 border rounded"
                                    onClick={() =>
                                      handleDelete(lesson.id, lesson.lessonName)
                                    }
                                  >
                                    <MdDeleteForever />
                                  </button> */}
                                </td>
                              </tr>
                            ))
                          
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center p-4">
                                No quizzes found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      )}
                    </div>
                  </div>
          
                  <div className="flex justify-between mt-4">
                    <p>Page {currentPage +1} of {totalPages}</p>
                    <div className="space-x-2">
                      <button className="bg-scolor p-1 hover:scale-105 duration-500" onClick={handlePrePage} disabled={currentPage === 0}>
                        <MdNavigateBefore size={30} />
                      </button>
                      <button className="bg-scolor p-1 hover:scale-105 duration-500" onClick={handledNextPage} disabled={currentPage === totalPages-1}>
                        <MdNavigateNext size={30} />
                      </button>
                    </div>
                  </div>
                </div>
                <ToastContainer /> 
          
              </div>
            );
          }
        

export default QuizzManagement;
