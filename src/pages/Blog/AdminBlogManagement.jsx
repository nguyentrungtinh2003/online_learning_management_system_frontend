import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
  MdForum,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import {
  getBlogs,
  searchBlogs,
  deleteBlog,
  getBlogsByPage,
} from "../../services/blogapi";

export default function AdminBlogManagement() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getBlogsByPage();
        if (!data?.data?.content) throw new Error("Invalid API Response");

        let fetchedBlogs = data.data.content;

        // Tìm kiếm
        if (search.trim() !== "") {
          const keyword = search.trim().toLowerCase();
          fetchedBlogs = fetchedBlogs.filter(
            (blog) =>
              blog.blogName?.toLowerCase().includes(keyword) ||
              blog.description?.toLowerCase().includes(keyword)
          );
        }

        // Filter by status (Deleted/Not Deleted)
        if (statusFilter === "Deleted") {
          fetchedBlogs = fetchedBlogs.filter((blog) => !blog.deleted);
        } else if (statusFilter === "Active") {
          fetchedBlogs = fetchedBlogs.filter((blog) => blog.deleted);
        }

        // Phân trang
        const startIndex = currentPage * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        const paginatedBlogs = fetchedBlogs.slice(startIndex, endIndex);

        setBlogs(paginatedBlogs.sort((a, b) => b.id - a.id));
        setTotalPages(Math.ceil(fetchedBlogs.length / blogsPerPage));
      } catch (error) {
        console.error("Lỗi tải blog:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, search, statusFilter]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setCurrentPage(0);
      setLoading(true);
      try {
        const data = await getBlogs();
        setBlogs(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("Lỗi tải lại danh sách:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const data = await searchBlogs(value, currentPage, blogsPerPage);
      setBlogs(data.data.content);
      setTotalPages(data.data.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa blog \"${title}\" không?`))
      return;

    try {
      await deleteBlog(id);
      const data = await getBlogs();
      setBlogs(data.data.content);
      setTotalPages(data.data.totalPages);
      toast.success("Xóa blog thành công!", {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Lỗi khi xóa blog:", error);
      toast.error("Không thể xóa blog!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleRestore = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to restore blog "${name}"?`
    );
    if (isConfirmed) {
      try {
        await restoreBlog(id);
        toast.success("Blog restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setBlogs(); // Reload quiz list
      } catch (error) {
        console.error("Error restoring blog:", error);
        toast.error("Failed to restore blog!", {
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
      <ToastContainer />
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 dark:text-darkText items-center">
            <MdForum size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-xl font-bold">Blog Management</h2>
          </div>
          <Link
            to="/admin/blog/add-blog"
            className="bg-scolor text-white px-4 py-2 rounded-xl hover:scale-105 drop-shadow-lg"
          >
            <FaPlus size={30} />
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchQuizzes();
          }}
          className="mb-4 flex gap-2"
        >
          <input
            type="text"
            placeholder="Search quizzes..."
            className="p-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded w-full focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0); // Reset page when status filter changes
            }}
            className="p-2 dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">All</option>
            <option value="Deleted">Deleted</option>
            <option value="Active">Active</option>
          </select>
          <button
            type="submit"
            className="bg-fcolor text-white p-2 rounded hover:scale-105"
          >
            Search
          </button>
        </form>

        <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground rounded-2xl drop-shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="dark:text-darkText">
              <tr className="text-center font-bold">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
                <th className="p-2">Image</th>
                <th className="p-2">Video</th>
                <th className="p-2 whitespace-nowrap">Created Date</th>
                <th className="p-2">Like</th>
                <th className="p-2">Author</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    Không có blog nào.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="text-center dark:text-darkSubtext"
                  >
                    <td className="p-2">{blog.id}</td>
                    <td className="p-2">{blog.title}</td>
                    <td className="p-2 truncate max-w-xs">
                      {blog.description}
                    </td>
                    <td className="p-2">
                      <img
                        src={blog.image}
                        alt="blog"
                        className="w-8 h-8 rounded mx-auto"
                      />
                    </td>
                    <td className="p-2">{blog.video}</td>
                    <td className="p-2">{blog.createdAt}</td>
                    <td className="p-2">{blog.interactions}</td>
                    <td className="p-2">{blog.views}</td>
                    <td className="p-2">{blog.author}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <Link
                        to={`/admin/blog/edit-blog/${blog.id}`}
                        className="p-2 border rounded hover:text-blue-500 hover:scale-105"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="p-2 border rounded text-red-600 hover:scale-105"
                        onClick={() => handleDelete(blog.id, blog.title)}
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

        <div className="flex justify-between items-center mt-4 text-white">
          <p>
            Trang {currentPage + 1} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="bg-scolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateBefore size={30} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="bg-scolor p-1 rounded disabled:opacity-50"
            >
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
