import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FaEdit, FaLock, FaLockOpen, FaPlus, FaTimes } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
  MdForum,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";

import {
  getBlogs,
  searchBlogs,
  deleteBlog,
  getBlogsByPage,
  restoreBlog,
} from "../../services/blogapi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import URL from "../../config/URLsocket";
import { useLocation } from "react-router-dom";

export default function AdminBlogManagement() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [allBlog, setAllBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState(new Map());
  const [blogSearch, setBlogSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const blogsPerPage = 6;

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("blogSearch");
    const savedStatusFilter = localStorage.getItem("statusFilter");

    if (savedSearch) setBlogSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerCourseReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("blogCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerBlogReload", handleReload);

    return () => {
      window.removeEventListener("triggerBlogReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // **Effect 3: Lọc khóa học từ cache và phân trang khi cache thay đổi**
  useEffect(() => {
    if (!cache.has("ALL-BLOGS")) return;

    let filteredBlogs = cache.get("ALL-BLOGS");

    // Lọc theo search
    if (blogSearch.trim() !== "") {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.blogName.toLowerCase().includes(blogSearch.trim().toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredBlogs = filteredBlogs.filter((blog) => blog.deleted);
    } else if (statusFilter === "Active") {
      filteredBlogs = filteredBlogs.filter((blog) => !blog.deleted);
    }

    // Phân trang
    const startIndex = currentPage * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const paginatedCourses = filteredBlogs.slice(startIndex, endIndex);

    setBlogs(paginatedCourses.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredBlogs.length / blogsPerPage));
    setLoading(false);
  }, [cache, blogSearch, statusFilter, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchBlogs();
  }, [cache, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const cacheKey = `${blogSearch.trim()}-${statusFilter}`;

      let fetchedBlogs;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedBlogs = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getBlogsByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedBlogs = data.data.content;

        // Lọc theo search
        if (blogSearch.trim() !== "") {
          fetchedBlogs = fetchedBlogs.filter((blog) =>
            blog.blogName
              .toLowerCase()
              .includes(blogSearch.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-BLOGS";
        if (!cache.has(ALL_KEY)) {
          const data = await getBlogsByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allCourses = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allCourses));
          setCache(newCache);
          localStorage.setItem(
            "blogCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedBlogs = fetchedBlogs.filter((blog) => blog.deleted);
        } else if (statusFilter === "Active") {
          fetchedBlogs = fetchedBlogs.filter((blog) => !blog.deleted);
        }

        const newCache = new Map(cache.set(cacheKey, fetchedBlogs));
        setCache(newCache);
        localStorage.setItem(
          "blogCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedBlogs.length === 0 && blogSearch.trim() !== "") {
        toast.info("No courses found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
      const startIndex = currentPage * blogsPerPage;
      const endIndex = startIndex + blogsPerPage;
      const paginatedCourses = fetchedBlogs.slice(startIndex, endIndex);

      setBlogs(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedBlogs.length / blogsPerPage));
    } catch (error) {
      console.error("Error loading courses:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("blogSearch", blogSearch);
    localStorage.setItem("statusFilter", statusFilter);
  }, [blogSearch, statusFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("blogCache");
    const savedNewBlogs = localStorage.getItem("newBlogs");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewBlogs) {
        const newBlogs = JSON.parse(savedNewBlogs);
        const key = `${blogSearch.trim()}-${statusFilter}`;

        const updatedBlogs = [...(parsedCache.get(key) || []), ...newBlogs];
        parsedCache.set(key, updatedBlogs);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "blogCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newBlogs");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("blog")) {
      setBlogSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  const handleSearchInput = (e) => {
    setBlogSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchCourses();
  };

  // useEffect(() => {
  //   fetchAllBlog();
  // }, []);

  // const fetchAllBlog = () => {
  //   axios
  //     .get(`${URL}/blogs/all`, { withCredentials: true })
  //     .then((response) => {
  //       setAllBlog(response.data.data);
  //     });
  // };

  // const fetchBlogs = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getBlogsByPage(currentPage, blogsPerPage);
  //     if (!data?.content && !data?.data?.content)
  //       throw new Error("Invalid API Response");

  //     const fetchedBlogs = data.data.content;
  //     setBlogs(fetchedBlogs.sort((a, b) => b.id - a.id));
  //     setTotalPages(data.data.totalPages);
  //   } catch (error) {
  //     console.error("Lỗi tải blog:", error);
  //     setBlogs([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchBlogs();
  // }, [currentPage]);

  // const handleSearch = async () => {
  //   setLoading(true);

  //   try {
  //     const data = await searchBlogs(search, currentPage, blogsPerPage);
  //     setBlogs(data.data.content);
  //     setTotalPages(data.data.totalPages);
  //   } catch (error) {
  //     console.error("Lỗi tìm kiếm blog:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   setCurrentPage(0);
  // }, [search]);

  // useEffect(() => {
  //   if (search.trim() !== "") {
  //     handleSearch();
  //   } else {
  //     fetchBlogs();
  //   }
  // }, []);

  const handleDelete = async (id, title, userId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa blog "${title}" không?`)) return;

    if (!userId) {
      toast.error("Thiếu userId! Không thể xóa blog.");
      return;
    }

    try {
      console.log("userId:", userId);
      const data = await deleteBlog(id, parseInt(userId));

      if (data.status === 200 || data.status === 204) {
        toast.success("Xóa blog thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Xóa blog thất bại!");
      console.error(error);
    }
  };

  const handleRestore = async (id, name, userId) => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục blog "${name}" không?`))
      return;

    if (!userId) {
      toast.error("Thiếu userId! Không thể khôi phục blog.");
      return;
    }

    try {
      const data = await restoreBlog(id, parseInt(userId));
      if (data.status === 200 || data.status === 204) {
        toast.success("Khôi phụcblog thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Khôi phục blog thất bại!");
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (statusFilter === "ALL") {
  //     fetchBlogs();
  //   } else {
  //     setBlogs(allBlog.filter((blog) => blog.deleted === statusFilter));
  //   }
  // }, [statusFilter, allBlog]);

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
          <Link to="/blog">
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex gap-2">
          <div className="relative h-24 lg:h-12 w-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full h- px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              value={blogSearch}
              onChange={handleSearchInput}
            />
            {blogSearch && (
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
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
                  <th className="p-2">{t("blog.like")}</th>
                  <th className="p-2">{t("blog.author")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={8} />
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
                      <td className="p-2 truncate max-w-xs">
                        {blog.description}
                      </td>
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
                      <td className="p-2">{blog.likedUsers?.length || 0}</td>
                      <td className="p-2">{blog.user?.username || "N/A"}</td>
                      <td className="p-2">
                        {blog.deleted ? (
                          <span className="text-red-600 font-semibold cursor-pointer">
                            {t("deleted")}
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold cursor-pointer">
                            {t("active")}
                          </span>
                        )}
                      </td>
                      <td className="p-2 flex justify-center gap-2">
                        <Link to={`/admin/blog/edit-blog/${blog.id}`}>
                          <button className="hover:text-blue-600">
                            <FaEdit />
                          </button>
                        </Link>
                        {blog.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() =>
                              handleRestore(
                                blog.id,
                                blog.blogName,
                                blog.user.id
                              )
                            }
                            title="Khôi phục bài viết"
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            onClick={() =>
                              handleDelete(blog.id, blog.blogName, blog.user.id)
                            }
                            title="Khóa người dùng"
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

        <div className="flex lg:text-base text-3xl pt-2 items-center justify-between">
          <p className="mx-2">
            {t("page")} {currentPage + 1} {t("of")} {totalPages}
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
        <ToastContainer />
      </div>
    </div>
  );
}
