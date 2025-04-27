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

import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
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
        const sortedCourses = data.data.content.sort((a, b) => b.id - a.id);
        setCourses(sortedCourses);
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
    const value = e.target.value; // Lưu giá trị trước khi setState
    setSearch(value);

    // Nếu người dùng xóa hết -> reset lại danh sách gốc
    if (value.trim() === "") {
      setCurrentPage(0);
      setLoading(true);
      try {
        const data = await getCoursesByPage(0, coursesPerPage); // hoặc gọi API ban đầu
        const sortedCourses = data.data.content.sort((a, b) => b.id - a.id); // Thêm sort ở đây
        setCourses(sortedCourses);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải lại danh sách:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Nếu có từ khóa tìm kiếm -> gọi search API
    setLoading(true);
    try {
      const data = await searchCourses(value, 0, coursesPerPage);
      const sortedCourses = data.data.content.sort((a, b) => b.id - a.id); // Thêm sort ở đây
      setCourses(sortedCourses);
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
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        toast.error("Không thể xóa khóa học!", {
          position: "top-right",
          autoClose: 1000,
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
                ) : courses?.length > 0 ? (
                  courses.map((course, index) => (
                    <tr key={course.id} className="text-center">
                      <td className="p-2">
                        {index + 1 + currentPage * coursesPerPage}
                      </td>
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
                        {course.date ? new Date(
                            course.date[0], 
                            course.date[1] - 1, 
                            course.date[2], 
                            course.date[3], 
                            course.date[4], 
                            course.date[5]
                          ).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
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
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Không có khóa học nào.
                    </td>
                  </tr>
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
