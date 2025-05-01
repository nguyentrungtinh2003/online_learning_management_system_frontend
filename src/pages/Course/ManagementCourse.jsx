import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { FaUsers, FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { MdNavigateNext, MdDeleteForever, MdNavigateBefore } from "react-icons/md";
import { Link } from "react-router-dom";
import { getCoursesByPage, deleteCourse, searchCourses } from "../../services/courseapi";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterType]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let data;
      // Fetch tất cả course 1 lần
      data = await getCoursesByPage(0, 1000); // Lấy nhiều hơn 6 cái, ví dụ 1000 courses
  
      if (!data || !data.data || !data.data.content) {
        throw new Error("Invalid API Response");
      }
  
      let fetchedCourses = data.data.content;
  
      // Lọc client
      if (search.trim() !== "") {
        fetchedCourses = fetchedCourses.filter(course =>
          course.courseName.toLowerCase().includes(search.trim().toLowerCase())
        );
      }
  
      if (filterType === "Free") {
        fetchedCourses = fetchedCourses.filter(
          (course) => course.price === 0 || course.price === null
        );
      } else if (filterType === "Paid") {
        fetchedCourses = fetchedCourses.filter(
          (course) => course.price !== null && course.price > 0
        );
      }
  
      // Phân trang lại
      const startIndex = currentPage * coursesPerPage;
      const endIndex = startIndex + coursesPerPage;
      const paginatedCourses = fetchedCourses.slice(startIndex, endIndex);
  
      setCourses(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedCourses.length / coursesPerPage));
    } catch (error) {
      console.error("Lỗi tải khóa học:", error);
      setCourses([]);
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
    fetchCourses();
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(`Bạn có chắc muốn xóa khóa học "${name}" không?`);
    if (isConfirmed) {
      try {
        await deleteCourse(id);
        toast.success("Xóa khóa học thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchCourses();
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        toast.error("Không thể xóa khóa học!", {
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
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex gap-2 dark:text-darkText">
            <FaBuffer size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold">Course Management</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/courses/add-course">
            <button className="cursor-pointer bg-fcolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} color="white" />
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            className="py-2 px-3 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
            value={search}
            onChange={handleSearchInput}
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
          <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
          <button
            type="submit"
            className="bg-fcolor text-white px-4 py-2 rounded hover:scale-105"
          >
            Search
          </button>
        </form>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-wcolor dark:bg-darkSubbackground dark:text-darkSubtext p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="text-center dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">STT</th>
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
                  <DataTableSkeleton rows={6} cols={8} />
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Không có khóa học nào
                    </td>
                  </tr>
                ) : (
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
                      <td className="p-2">
                        {course.price === 0 || course.price === null
                          ? "Free"
                          : `${course.price} VND`}
                      </td>
                      <td className="p-2">
                        {course.date
                          ? new Date(
                              course.date[0],
                              course.date[1] - 1,
                              course.date[2],
                              course.date[3],
                              course.date[4],
                              course.date[5]
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
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
                          onClick={() => handleDelete(course.id, course.courseName)}
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <p>Page {currentPage + 1} of {totalPages}</p>
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
}
