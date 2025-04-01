import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { FaUsers, FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";
import {
  getCourses,
  deleteCourse,
  getCoursesByPage,
  searchCourses,
} from "../../services/courseapi";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCoursesByPage(currentPage, coursesPerPage);
        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }
        setCourses(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải khóa học:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [currentPage]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setCurrentPage(0);
      return;
    }
    setLoading(true);
    try {
      const data = await searchCourses(
        e.target.value,
        currentPage,
        coursesPerPage
      );
      setCourses(data.data.content);
      setTotalPages(data.data.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa khóa học "${name}" không?`
    );
    if (isConfirmed) {
      try {
        await deleteCourse(id);
        const data = await getCoursesByPage(currentPage, coursesPerPage);
        setCourses(data.data.content);
        setTotalPages(data.data.totalPages);
        toast.success("Xóa khóa học thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        toast.error("Không thể xóa khóa học!", {
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
    <div className="flex-1 h-screen">
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <AdminNavbar />
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <FaBuffer size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold mb-4">Course Management</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/courses/add-course">
            <button className="cursor-pointer bg-fcolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} color="white" />
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
            <table className="w-full">
              <thead>
                <tr className="text-center font-bold">
                  <th className="p-2">ID</th>
                  <th className="p-2">Course Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Created Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, index) => (
                    <tr key={index} className="text-center">
                      {Array(8)
                        .fill(null)
                        .map((_, i) => (
                          <td key={i} className="p-2">
                            <div className="h-8 w-full my-1 bg-gray-300 rounded mx-auto"></div>
                          </td>
                        ))}
                    </tr>
                  ))
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id} className="text-center">
                      <td className="p-2">{course.id}</td>
                      <td className="p-2">{course.courseName || "N/A"}</td>
                      <td className="p-2">
                        {course.description || "No description"}
                      </td>
                      <td className="p-2">
                        {course.img ? (
                          <img
                            src={course.img}
                            alt="course"
                            className="w-8 h-8 rounded mx-auto"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td className="p-2">{course.price || "Free"}</td>
                      <td className="p-2">
                        {course.date
                          ? new Date(course.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-2">
                        {course.isDeleted ? "Inactive" : "Active"}
                      </td>
                      <td className="p-2 flex justify-center gap-1">
                        <Link
                          to={`/admin/courses/${course.id}/lessons`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/courses/edit-course/${course.id}`}
                          className="p-2 border rounded"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="p-2 border rounded"
                          onClick={() =>
                            handleDelete(course.id, course.courseName)
                          }
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  [...Array(6)].map((_, index) => (
                    <tr key={index} className="text-center">
                      {Array(8)
                        .fill(null)
                        .map((_, i) => (
                          <td key={i} className="p-2">
                            <div className="h-8 w-full my-1 bg-gray-300 rounded mx-auto"></div>
                          </td>
                        ))}
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
              onClick={handledNextPage}
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
