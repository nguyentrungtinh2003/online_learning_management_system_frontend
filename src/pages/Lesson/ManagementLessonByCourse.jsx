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
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { MdQuiz } from "react-icons/md"; // nếu dùng Material Design icon cho quiz

export default function ManagementLesson() {
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
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <Link className="flex gap-2" onClick={() => navigate(-1)}>
            <FaBuffer size={30} />
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold">Back</h2>
          </Link>
          <Link
            to={`/admin/courses/${courseId}/lessons/add`}
            className="hover:text-ficolor"
          >
            <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

        {/* Search & Filter */}
        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search lessons..."
              className="py-2 px-3 pr-10 border-2 rounded w-full focus:outline-none dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext"
              value={search}
              onChange={handleSearchInput}
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setSearch("");
                  fetchLessons(); // reset danh sách khi xóa tìm kiếm
                }}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
              fetchLessons();
            }}
            className="p-2 border-2 rounded dark:bg-darkSubbackground dark:text-darkText dark:border-darkBorder"
          >
            <option value="All">All</option>
            <option value="Deleted">Deleted</option>
            <option value="Active">Active</option>
          </select>

          <button
            type="submit"
            className="bg-fcolor text-white px-4 py-2 rounded hover:scale-105"
          >
            Search
          </button>
        </form>

        {/* Lesson List */}
        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            {loading ? (
              <p className="text-center">Loading lessons...</p>
            ) : lessons.length === 0 ? (
              <p className="text-center py-4">No lessons found</p>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-center font-bold">
                    <th className="p-2">STT</th>
                    <th className="p-2">Lesson Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Image</th>
                    <th className="p-2">Created Date</th>
                    <th className="p-2">Video URL</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson, index) => (
                    <tr key={lesson.id} className="text-center border-t">
                      <td className="p-2">
                        {index + 1 + currentPage * lessonsPerPage}
                      </td>
                      <td className="p-2">{lesson.lessonName}</td>
                      <td className="p-2 truncate max-w-[200px]">
                        {lesson.description}
                      </td>
                      <td className="p-2">
                        {<lesson className="img"></lesson> ? (
                          <img
                            src={lesson.img}
                            alt="lesson"
                            className="w-16 h-16 object-cover rounded mx-auto"
                          />
                        ) : (
                          <span>No Image</span>
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
                      </td>{" "}
                      <td className="p-2">
                        {lesson.videoUrl ? (
                          <a
                            href={lesson.videoURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View Video
                          </a>
                        ) : (
                          <span>No Video</span>
                        )}
                      </td>
                      <td className="p-2 h-[44px]">
                        <div className="flex items-center justify-center h-full min-h-[3rem]">
                          {lesson.deleted ? (
                            <span className="text-red-500 flex items-center gap-1">
                              <FaLock /> Deleted
                            </span>
                          ) : (
                            <span className="text-green-500 flex items-center gap-1">
                              <FaLockOpen /> Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 h-[44px]">
                        <div className="flex items-center justify-center gap-2 h-full">
                          {!lesson.deleted ? (
                            <>
                              {/* Nút Thêm Quiz */}
                              <Link
                                to={`/admin/lessons/${lesson.id}/quizzes`}
                                className="text-purple-500 hover:text-purple-700"
                                title="Add Quiz"
                              >
                                <MdQuiz size={22} />{" "}
                                {/* hoặc bạn dùng icon phù hợp */}
                              </Link>

                              {/* Nút Sửa bài học */}
                              <Link
                                to={`/admin/courses/${courseId}/lessons/edit/${lesson.id}`}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit Lesson"
                              >
                                <FaEdit size={20} />
                              </Link>

                              {/* Nút Xóa bài học */}
                              <button
                                onClick={() =>
                                  handleDelete(lesson.id, lesson.lessonName)
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Delete Lesson"
                              >
                                <MdDeleteForever size={24} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                handleRestore(lesson.id, lesson.lessonName)
                              }
                              className="text-green-500 hover:text-green-700"
                              title="Restore Lesson"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
