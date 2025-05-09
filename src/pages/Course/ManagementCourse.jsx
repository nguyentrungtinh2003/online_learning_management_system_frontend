import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { FaUsers, FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  getCoursesByPage,
  deleteCourse,
  restoreCourse,
  searchCourses,
} from "../../services/courseapi";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { FaLockOpen, FaLock, FaTimes, FaCoins } from "react-icons/fa";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, statusFilter, filterType]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let data;
      // Fetch all courses once
      data = await getCoursesByPage(0, 1000); // Get more than 6 courses, e.g., 1000 courses

      if (!data || !data.data || !data.data.content) {
        throw new Error("Invalid API Response");
      }

      let fetchedCourses = data.data.content;

      // Client-side search filter
      if (search.trim() !== "") {
        fetchedCourses = fetchedCourses.filter((course) =>
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

      // Filter by status (Deleted/Not Deleted)
      if (statusFilter === "Deleted") {
        fetchedCourses = fetchedCourses.filter((course) => course.deleted);
      } else if (statusFilter === "Active") {
        fetchedCourses = fetchedCourses.filter((course) => !course.deleted);
      }

      // 🔔 Hiện thông báo nếu không tìm thấy kết quả
      if (fetchedCourses.length === 0 && search.trim() !== "") {
        toast.info("No courses found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Pagination
      const startIndex = currentPage * coursesPerPage;
      const endIndex = startIndex + coursesPerPage;
      const paginatedCourses = fetchedCourses.slice(startIndex, endIndex);

      setCourses(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedCourses.length / coursesPerPage));
    } catch (error) {
      console.error("Error loading courses:", error);
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
    const isConfirmed = window.confirm(
      `Are you sure you want to delete course "${name}"?`
    );
    if (isConfirmed) {
      try {
        await deleteCourse(id);
        toast.success("Course deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore course "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreCourse(id);
        toast.success("Course restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchCourses(); // Reload courses list
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
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses..."
              className="py-2 px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              value={search}
              onChange={handleSearchInput}
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setSearch("");
                }}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>

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

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
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

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext p-4 rounded-2xl">
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
                      No courses available
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={course.id} className="text-center">
                      <td className="p-2">
                        {index + 1 + currentPage * coursesPerPage}
                      </td>
                      <td className="p-2">{course.courseName || "N/A"}</td>
                      <td
                        className="p-2"
                        dangerouslySetInnerHTML={{
                          __html: course.description || "No description",
                        }}
                      />
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
                        {course.price === 0 || course.price === null ? (
                          "Free"
                        ) : (
                          <>
                            {course.price}{" "}
                            <FaCoins className="inline text-yellow-500" />
                          </>
                        )}
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
                        {course.deleted ? "Deleted" : "Active"}
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
                        {course.deleted ? (
                          <button
                            className="p-2 border rounded"
                            onClick={() =>
                              handleRestore(course.id, course.courseName)
                            }
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border rounded"
                            onClick={() =>
                              handleDelete(course.id, course.courseName)
                            }
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

        <div className="flex items-center justify-between">
          <p>
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-scolor p-1 rounded disabled:opacity-50"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore fontSize={30} />
            </button>
            <button
              className="bg-scolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <MdNavigateNext fontSize={30} />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
