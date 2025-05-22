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
  restoreBlog,
} from "../../services/blogapi";
import { useTranslation } from "react-i18next";

export default function AdminBlogManagement() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getBlogsByPage(currentPage, blogsPerPage);
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
          fetchedBlogs = fetchedBlogs.filter((blog) => blog.deleted);
        } else if (statusFilter === "Active") {
          fetchedBlogs = fetchedBlogs.filter((blog) => !blog.deleted);
        }

        // Phân trang
        const startIndex = currentPage * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        const paginatedBlogs = fetchedBlogs.slice(startIndex, endIndex);

        setBlogs(fetchedBlogs.sort((a, b) => b.id - a.id));
        setTotalPages(data.data.totalPages);
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
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <MdForum size={isMobile ? 50 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-4xl lg:text-lg font-bold">{t("blog.title")}</h2>
          </div>
          <Link
            to="/admin/blog/add-blog"
            className="hover:text-ficolor"
          >
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
               <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBlogs();
          }}
          className="mb-2 lg:h-12 h-24 flex gap-2"
        >
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
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
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-72 lg:w-48"
          >
            <option value="All">{t("all")}</option>
            <option value="Deleted">{t("deleted")}</option>
            <option value="Active">{t("active")}</option>
          </select>
          <button
            type="submit"
            className="bg-wcolor lg:text-base text-3xl hover:bg-tcolor dark:hover:bg-darkHover dark:bg-darkSubbackground dark:border-darkBorder border-2 whitespace-nowrap px-4 py-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        <div className="flex-1 w-full overflow-auto h-full overflow-x">
          <div className="bg-wcolor lg:px-2 px-4 overflow-auto h-full justify-between flex flex-col lg:h-fit dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("blog.blogTitle")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2 whitespace-nowrap">{t("createdDate")}</th>
                  <th className="p-2">{t("blog.author")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
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
                      {t("blog.noBlog")}
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog, index) => (
                    <tr
                      key={blog.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * blogsPerPage}
                      </td>
                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {blog.blogName?.length > 20
                          ? blog.blogName.slice(0, 20) + "..."
                          : blog.blogName || "N/A"}
                      </td>
                      <td className="p-2 truncate max-w-xs">{blog.description}</td>
                      <td className="p-2">
                        {blog.date
                          ? new Date(
                              blog.date[0],
                              blog.date[1] - 1,
                              blog.date[2],
                              blog.date[3],
                              blog.date[4],
                              blog.date[5]
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="p-2">{blog.user.username}</td>
                      <td className="p-2">
                        {blog.deleted ? (
                          <span className="text-red-600 font-semibold">Deleted</span>
                        ) : (
                          <span className="text-green-600 font-semibold">Active</span>
                        )}
                      </td>
                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <Link
                          to={`edit-blog/${blog.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa blog"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                          onClick={() => handleDelete(blog.id, blog.blogName)}
                          title="Xóa blog"
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
        <div className="flex lg:text-base text-3xl pt-2 items-center justify-between">
        <p className="mx-2">
            {loading
              ? t("Loading") // Hiển thị "Loading..." nếu đang tải
              : `${t("page")} ${currentPage + 1} ${t("of")} ${totalPages}`}{" "}
            {/* Nếu không phải loading, hiển thị thông tin page */}
          </p>
        <div className="flex gap-2">
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
            <MdNavigateNext size={isMobile ? 55 : 30} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
