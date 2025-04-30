import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { MdNavigateNext, MdDeleteForever, MdNavigateBefore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import {
  deleteLesson,
  searchLessons,
  getLessonByPage,
} from "../../services/lessonapi";

export default function ManagementLesson() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const lessonsPerPage = 6;

  // Fetch lessons theo courseId
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const data = await getLessonByPage(currentPage, lessonsPerPage);
        if (!data?.data?.content) throw new Error("Invalid API Response");
        setLessons(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải bài học:", error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [currentPage]);

  // Tìm kiếm bài học
  const handleSearch = async (e) => {
    const value = e.target.value; // Lưu giá trị trước khi setState
    setSearch(value);

    // Nếu người dùng xóa hết -> reset lại danh sách gốc
    if (value.trim() === "") {
      setCurrentPage(0);
      setLoading(true);
      try {
        const data = await getLessonByPage(0, lessonsPerPage); // hoặc gọi API ban đầu
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài học "${name}" không?`)) return;
  
    try {
      await deleteLesson(id);
      const data = await getLessonByPage(currentPage, lessonsPerPage); // dùng API đã sửa
      setLessons(data.data.content);
      setTotalPages(data.data.totalPages);
      toast.success("Xóa bài học thành công!", { position: "top-right", autoClose: 1000 });
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
      toast.error("Không thể xóa bài học!", { position: "top-right", autoClose: 1000 });
    }
  };
  

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex-1 h-screen">
      <div className="w-full flex flex-col h-full py-4 px-3">

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <Link className="flex gap-2" onClick={() => navigate(-1)}>
            <FaBuffer size={30} />
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold">Back</h2>
          </Link>
          <Link to={`/admin/lessons/add`} className="hover:text-ficolor">
          <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

        {/* Tìm kiếm */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search lessons..."
            className="p-2 border rounded w-full focus:outline-none"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Danh sách bài học */}
        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            {loading ? (
              <p className="text-center">Loading lessons...</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-center font-bold">
                    <th className="p-2">STT</th>
                    <th className="p-2">Lesson Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Image</th>
                    <th className="p-2">Created Date</th>
                    <th className="p-2">Video URL</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                      <tr key={lesson.id} className="text-center">
                        <td className="p-2">{index + 1 + currentPage * lessonsPerPage}</td>
                        <td className="p-2">{lesson.lessonName || "N/A"}</td>
                        <td className="p-2">{lesson.description || "No description"}</td>
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
                        {lesson.date ? new Date(
                            lesson.date[0], 
                            lesson.date[1] - 1, 
                            lesson.date[2], 
                            lesson.date[3], 
                            lesson.date[4], 
                            lesson.date[5]
                          ).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
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
                              View Video
                            </a>
                          ) : (
                            "No video"
                          )}
                        </td>
                        <td className="p-2 flex justify-center gap-1">
                          <Link
                            to={`/admin/lessons/${lesson.id}/quizzes`}
                            className="p-2 border rounded"
                          >
                            <FaEye />
                          </Link>
                          <Link to={`/admin/lessons/edit/${lesson.id}`} 
                          className="p-2 border rounded">
                            <FaEdit />
                          </Link>
                          <button
                            className="p-2 border rounded"
                            onClick={() => handleDelete(lesson.id, lesson.lessonName)}
                          >
                            <MdDeleteForever />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No lessons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <p>
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-scolor p-1 hover:scale-105 duration-500"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              className="bg-scolor p-1 hover:scale-105 duration-500"
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
}
