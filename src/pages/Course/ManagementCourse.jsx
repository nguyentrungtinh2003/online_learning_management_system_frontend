import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBuffer,
  FaEdit,
  FaEye,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  getCoursesByPage,
  deleteCourse,
  restoreCourse,
} from "../../services/courseapi";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { FaLockOpen, FaLock, FaTimes, FaCoins } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function CourseManagement() {
  const { t } = useTranslation("adminmanagement");
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cache, setCache] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const coursesPerPage = 6;
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    const savedFilterType = localStorage.getItem("filterType");
    const savedStatusFilter = localStorage.getItem("statusFilter");

    if (savedSearch) setSearch(savedSearch);
    if (savedFilterType) setFilterType(savedFilterType);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerCourseReload**
  useEffect(() => {
    const handleReload = () => {
      triggerReload(); // Gọi trigger để re-fetch cache và courses
    };
    window.addEventListener("triggerCourseReload", handleReload);

    return () => {
      window.removeEventListener("triggerCourseReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // **Effect 3: Lọc khóa học từ cache và phân trang khi cache thay đổi**
  useEffect(() => {
    if (!cache.has("ALL-DATA")) return;

    let filteredCourses = cache.get("ALL-DATA");

    // Lọc theo search
    if (search.trim() !== "") {
      filteredCourses = filteredCourses.filter((course) =>
        course.courseName.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    // Lọc theo giá
    if (filterType === "Free") {
      filteredCourses = filteredCourses.filter(
        (course) => course.price === 0 || course.price === null
      );
    } else if (filterType === "Paid") {
      filteredCourses = filteredCourses.filter(
        (course) => course.price !== null && course.price > 0
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredCourses = filteredCourses.filter((course) => course.deleted);
    } else if (statusFilter === "Active") {
      filteredCourses = filteredCourses.filter((course) => !course.deleted);
    }

    // Phân trang
    const startIndex = currentPage * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    setCourses(paginatedCourses.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredCourses.length / coursesPerPage));
    setLoading(false);
  }, [cache, search, filterType, statusFilter, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchCourses();
  }, [cache, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const cacheKey = `${search.trim()}-${filterType}-${statusFilter}`;

      let fetchedCourses;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedCourses = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getCoursesByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedCourses = data.data.content;

        // Lọc theo search
        if (search.trim() !== "") {
          fetchedCourses = fetchedCourses.filter((course) =>
            course.courseName
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-DATA";
        if (!cache.has(ALL_KEY)) {
          const data = await getCoursesByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allCourses = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allCourses));
          setCache(newCache);
          localStorage.setItem(
            "courseCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo giá
        if (filterType === "Free") {
          fetchedCourses = fetchedCourses.filter(
            (course) => course.price === 0 || course.price === null
          );
        } else if (filterType === "Paid") {
          fetchedCourses = fetchedCourses.filter(
            (course) => course.price !== null && course.price > 0
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedCourses = fetchedCourses.filter((course) => course.deleted);
        } else if (statusFilter === "Active") {
          fetchedCourses = fetchedCourses.filter((course) => !course.deleted);
        }

        const newCache = new Map(cache.set(cacheKey, fetchedCourses));
        setCache(newCache);
        localStorage.setItem(
          "courseCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedCourses.length === 0 && search.trim() !== "") {
        toast.info("No courses found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
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

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("search", search);
    localStorage.setItem("filterType", filterType);
    localStorage.setItem("statusFilter", statusFilter);
  }, [search, filterType, statusFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("courseCache");
    const savedNewCourses = localStorage.getItem("newCourses");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewCourses) {
        const newCourses = JSON.parse(savedNewCourses);
        const key = `${search.trim()}-${filterType}-${statusFilter}`;

        const updatedCourses = [...(parsedCache.get(key) || []), ...newCourses];
        parsedCache.set(key, updatedCourses);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "courseCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newCourses");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("course")) {
      setSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

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

        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("courseCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc tuỳ bộ lọc hiện tại
          const existingCourses = parsedCache.get(key) || [];

          const updatedCourses = existingCourses.filter(
            (course) => course.id !== id
          );
          parsedCache.set(key, updatedCourses);

          localStorage.setItem(
            "courseCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các useEffect khác reload
        window.dispatchEvent(new Event("triggerCourseReload"));

        toast.success("Course deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
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

        // ✅ Cập nhật courseCache trong localStorage nếu có
        const savedCache = localStorage.getItem("courseCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));
          const key = `--ALL--ALL`; // hoặc key tương ứng với filter hiện tại

          const existingCourses = parsedCache.get(key) || [];

          const updatedCourses = existingCourses.map((course) =>
            course.id === id ? { ...course, deleted: false } : course
          );

          parsedCache.set(key, updatedCourses);

          localStorage.setItem(
            "courseCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi sự kiện để các component khác reload nếu cần
        window.dispatchEvent(new Event("triggerCourseReload"));

        toast.success("Course restored successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
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

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <FaBuffer size={isMobile ? 60 : 30} />
            <MdNavigateNext size={isMobile ? 80 : 30} />
            <h2 className="text-5xl lg:text-lg font-bold">{t("courseManagement")}</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/courses/add-course">
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
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Free">{t("free")}</option>
            <option value="Paid">{t("paid")}</option>
          </select>

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

        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 px-4 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead>
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("courseName")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("instructor")}</th>
                  <th className="p-2">{t("price")}</th>
                  <th className="p-2">{t("createdDate")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={8} />
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {t("noCourse")}
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={course.id} className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover">
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * coursesPerPage}
                      </td>
                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {course.courseName?.length > 20
                          ? course.courseName.slice(0, 20) + "..."
                          : course.courseName || "N/A"}
                      </td>

                      <td className="py-2 lg:w-56 whitespace-nowrap">
                        {course.description
                          ? stripHtml(course.description).slice(0, 25) +
                            (stripHtml(course.description).length > 20
                              ? "..."
                              : "")
                          : "No description"}
                      </td>

                      <td className="p-2 text-center lg:w-40">
                        {course.user?.username || "No username"}
                      </td>
                      <td className="p-2 lg:w-32">
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
                      <td className="p-2 w-32">
                        {course.deleted ? "Deleted" : "Active"}
                      </td>
                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        {/* Điều hướng đến danh sách phụ */}
                        <Link
                          to={`/admin/courses/${course.id}/lessons`}
                          className="p-2 h-fit border-2 dark:border-darkBorder rounded bg-indigo-500 hover:bg-indigo-400 text-white"
                          title="Xem danh sách liên quan"
                        >
                          <FaArrowRight />
                        </Link>

                        {/* Xem chi tiết */}
                        <Link
                          to={`/view-course/${course.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-500 hover:bg-green-400 text-white"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Link>

                        {/* Chỉnh sửa */}
                        <Link
                          to={`/admin/courses/edit-course/${course.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>

                        {/* Khóa hoặc Khôi phục */}
                        {course.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded text-white bg-blue-600 hover:bg-blue-500"
                            onClick={() =>
                              handleRestore(course.id, course.courseName)
                            }
                            title="Khôi phục khóa học"
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            onClick={() =>
                              handleDelete(course.id, course.courseName)
                            }
                            title="Khóa khóa học"
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
                {loading
                  ? t("Loading") // Hiển thị "Loading..." nếu đang tải
                  : `${t("page")} ${currentPage + 1} ${t("of")} ${totalPages}`}{" "}
                {/* Nếu không phải loading, hiển thị thông tin page */}
              </p>
              <div className="space-x-2">
                <button
                  className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
                  onClick={handlePrePage}
                  disabled={currentPage === 0 || loading}
                >
                  <MdNavigateBefore fontSize={isMobile ? 55 : 30} />
                </button>
                <button
                  className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 p-1 hover:bg-tcolor rounded disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  <MdNavigateNext fontSize={isMobile ? 55 : 30} />
                </button>
              </div>
            </div>
      </div>
    </div>
  );
}
