import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import {
  FaBuffer,
  FaPlus,
  FaTimes,
  FaEye,
  FaEdit,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { getCourseMaterialByPage } from "../../services/courseapi";

const ManagementCourseMaterial = () => {
  const { t } = useTranslation("adminmanagement");
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState(new Map());

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const size = 6; // số lượng mỗi trang

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const [reloadTrigger, setReloadTrigger] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    const savedStatusFilter = localStorage.getItem("statusFilter");

    if (savedSearch) setSearch(savedSearch);
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerCourseReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("materialCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerCourseMaterialReload", handleReload);

    return () => {
      window.removeEventListener("triggerCourseMaterialReload", handleReload);
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
        course.title.toLowerCase().includes(search.trim().toLowerCase())
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

    setCourseMaterials(paginatedCourses.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredCourses.length / coursesPerPage));
    setLoading(false);
  }, [cache, search, statusFilter, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchCourses();
  }, [cache, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const cacheKey = `${search.trim()}-${statusFilter}`;

      let fetchedCourses;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedCourses = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getCourseMaterialByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedCourses = data.data.content;

        // Lọc theo search
        if (search.trim() !== "") {
          fetchedCourses = fetchedCourses.filter((course) =>
            course.title.toLowerCase().includes(search.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-DATA";
        if (!cache.has(ALL_KEY)) {
          const data = await getCourseMaterialByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allCourses = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allCourses));
          setCache(newCache);
          localStorage.setItem(
            "materialCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedCourses = fetchedCourses.filter(
            (material) => material.deleted
          );
        } else if (statusFilter === "Active") {
          fetchedCourses = fetchedCourses.filter(
            (material) => !material.deleted
          );
        }

        const newCache = new Map(cache.set(cacheKey, fetchedCourses));
        setCache(newCache);
        localStorage.setItem(
          "materialCache",
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
      const startIndex = currentPage * size;
      const endIndex = startIndex + size;
      const paginatedCourses = fetchedCourses.slice(startIndex, endIndex);

      setCourseMaterials(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedCourses.length / size));
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourseMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("search", search);
    localStorage.setItem("statusFilter", statusFilter);
  }, [search, statusFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("materialCache");
    const savedNewCourses = localStorage.getItem("newCourseMaterial");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewCourses) {
        const newCourses = JSON.parse(savedNewCourses);
        const key = `${search.trim()}-${statusFilter}`;

        const updatedCourses = [...(parsedCache.get(key) || []), ...newCourses];
        parsedCache.set(key, updatedCourses);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "courseCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newCourseMaterial");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("course-material")) {
      setSearch(""); // Reset khi chuyển sang trang lesson
      setStatusFilter("All");
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  // // Hàm gọi API với các tham số filter, search, page
  // const fetchCourseMaterials = () => {
  //   setLoading(true);
  //   // build query params
  //   let params = `?page=${currentPage}&size=${size}`;

  //   if (search.trim() !== "")
  //     params += `&search=${encodeURIComponent(search.trim())}`;

  //   if (filterType !== "All") params += `&type=${filterType}`;

  //   if (statusFilter !== "All") params += `&status=${statusFilter}`;

  //   axios
  //     .get(`${URL}/course-materials/page${params}`, { withCredentials: true })
  //     .then((response) => {
  //       const data = response.data.data;
  //       setCourseMaterials(data.content);
  //       setTotalPages(data.totalPages);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.error("Lỗi get course material " + error.message);
  //       toast.error(t("fetchError") || "Lỗi khi tải dữ liệu", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         transition: Slide,
  //       });
  //     });
  // };

  // // gọi API khi các state filter/search/page thay đổi
  // useEffect(() => {
  //   fetchCourseMaterials();
  // }, [search, filterType, statusFilter, currentPage]);

  const coursesPerPage = 6;

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchCourses();
  };

  // const handleFilterTypeChange = (e) => {
  //   setFilterType(e.target.value);
  //   setCurrentPage(0);
  // };
  // const handleStatusFilterChange = (e) => {
  //   setStatusFilter(e.target.value);
  //   setCurrentPage(0);
  // };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };
  const handlePrePage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(t("deleteConfirm", { name }))) {
      try {
        // Gọi API xóa
        await axios.delete(`${URL}/course-materials/delete/${id}`, {
          withCredentials: true,
        });

        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("materialCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));

          // Cập nhật toàn bộ dữ liệu trong cache (ALL-DATA)
          const allData = parsedCache.get("ALL-DATA") || [];
          const updatedAllData = allData.map((material) =>
            material.id === id ? { ...material, deleted: true } : material
          );
          parsedCache.set("ALL-DATA", updatedAllData);

          // Cập nhật cache theo bộ lọc hiện tại
          const currentKey = `${search.trim()}-${statusFilter}`;
          if (parsedCache.has(currentKey)) {
            const currentList = parsedCache.get(currentKey);
            const updatedList = currentList.map((material) =>
              material.id === id ? { ...material, deleted: true } : material
            );
            parsedCache.set(currentKey, updatedList);
          }

          // Lưu lại cache đã cập nhật
          localStorage.setItem(
            "materialCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các component khác reload
        window.dispatchEvent(new Event("triggerCourseMaterialReload"));

        toast.success(t("deleteSuccess"), {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      } catch (error) {
        console.error("Lỗi khi xoá tài liệu:", error);
        toast.error(t("deleteError"), {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      }
    }
  };

  const handleRestore = async (id, name) => {
    if (window.confirm(t("restoreConfirm", { name }))) {
      try {
        // Gọi API khôi phục
        await axios.put(
          `${URL}/course-materials/restore/${id}`,
          {},
          { withCredentials: true }
        );

        // ✅ Cập nhật cache trong localStorage
        const savedCache = localStorage.getItem("materialCache");
        if (savedCache) {
          const parsedCache = new Map(JSON.parse(savedCache));

          // Cập nhật ALL-DATA
          const allData = parsedCache.get("ALL-DATA") || [];
          const updatedAllData = allData.map((material) =>
            material.id === id ? { ...material, deleted: false } : material
          );
          parsedCache.set("ALL-DATA", updatedAllData);

          // Cập nhật cache hiện tại
          const currentKey = `${search.trim()}-${statusFilter}`;
          if (parsedCache.has(currentKey)) {
            const currentList = parsedCache.get(currentKey);
            const updatedList = currentList.map((material) =>
              material.id === id ? { ...material, deleted: false } : material
            );
            parsedCache.set(currentKey, updatedList);
          }

          // Lưu lại cache mới
          localStorage.setItem(
            "materialCache",
            JSON.stringify(Array.from(parsedCache.entries()))
          );
        }

        // ✅ Gửi event để các component khác reload
        window.dispatchEvent(new Event("triggerCourseMaterialReload"));

        toast.success(t("restoreSuccess"), {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      } catch (error) {
        console.error("Lỗi khi khôi phục tài liệu:", error);
        toast.error(t("restoreError"), {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      }
    }
  };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        {/* Header với icon, tiêu đề và nút thêm */}
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <FaBuffer size={isMobile ? 50 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-4xl lg:text-lg font-bold">
              {t("courseMaterialManagement")}
            </h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/course-material/add">
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
        </div>

        {/* Form tìm kiếm + lọc */}
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

          {/* <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Free">{t("free")}</option>
            <option value="Paid">{t("paid")}</option>
          </select> */}

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

        {/* Bảng dữ liệu */}
        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor px-2 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("title")}</th>
                  <th className="p-2">{t("description")}</th>
                  <th className="p-2">{t("file")}</th>
                  {/* <th className="p-2">{t("createdDate")}</th> */}
                  <th className="p-2">{t("course")}</th>
                  <th className="p-2">{t("instructor")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={9} />
                ) : courseMaterials.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      {t("noCourseMaterial")}
                    </td>
                  </tr>
                ) : (
                  courseMaterials.map((material, index) => (
                    <tr
                      key={material.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * coursesPerPage}
                      </td>
                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {material.title?.length > 20
                          ? material.title.slice(0, 20) + "..."
                          : material.title || "N/A"}
                      </td>

                      <td className="py-2 lg:w-56 whitespace-nowrap">
                        {material.description
                          ? stripHtml(material.description).slice(0, 25) +
                            (stripHtml(material.description).length > 20
                              ? "..."
                              : "")
                          : "No description"}
                      </td>

                      <td className="p-2 lg:w-32 whitespace-nowrap">
                        <a
                          href={material.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Xem tệp
                        </a>
                      </td>

                      {/* <td className="p-2">
                        {Array.isArray(material.createdDate)
                          ? new Date(
                              material.createdDate[0],
                              material.createdDate[1] - 1,
                              material.createdDate[2],
                              material.createdDate[3] || 0,
                              material.createdDate[4] || 0,
                              material.createdDate[5] || 0
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td> */}

                      <td className="p-2 lg:w-48 whitespace-nowrap">
                        {material.courseName?.length > 20
                          ? material.courseName.slice(0, 20) + "..."
                          : material.courseName || "N/A"}
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        {material.lecturerName || "N/A"}
                      </td>

                      <td className="p-2 w-40">
                        {material.deleted ? (
                          <p className="text-red-600 font-semibold">
                            {t("deleted")}
                          </p>
                        ) : (
                          <p className="text-green-600 font-semibold">
                            {t("active")}
                          </p>
                        )}
                      </td>
                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <>
                          {/* <Link
                              to={`/admin/course-material/view/${material.id}`}
                              title={t("view")}
                              className="p-2 border-2 dark:border-darkBorder rounded bg-green-500 hover:bg-green-400 text-white"
                            >
                              <FaEye />
                            </Link> */}
                          <Link
                            to={`/admin/course-material/edit/${material.id}`}
                            title={t("edit")}
                            className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          >
                            <FaEdit />
                          </Link>

                          {/* Khóa hoặc Khôi phục */}
                          {material.deleted ? (
                            <button
                              className="p-2 border-2 dark:border-darkBorder rounded text-white bg-blue-600 hover:bg-blue-500"
                              onClick={() =>
                                handleRestore(material.id, material.title)
                              }
                            >
                              <FaLockOpen />
                            </button>
                          ) : (
                            <button
                              className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                              onClick={() =>
                                handleDelete(material.id, material.title)
                              }
                            >
                              <FaLock />
                            </button>
                          )}
                        </>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Phân trang */}
        <div className="flex lg:text-base text-3xl pt-2 items-center justify-between">
          <p className="mx-2">
            {t("page")} {currentPage + 1} {t("of")} {totalPages}
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
};

export default ManagementCourseMaterial;
