import { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { FaLock, FaPlus, FaLockOpen, FaEye, FaTimes } from "react-icons/fa";

import { Link } from "react-router-dom";
import { MdNavigateNext, MdNavigateBefore, MdPayment } from "react-icons/md";
import URL from "../../config/URLconfig";
import axios from "axios";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getPaymentByPage } from "../../services/paymentapi";

export default function TransactionAdmin() {
  const { t } = useTranslation("adminmanagement");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [cache, setCache] = useState(new Map());
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const paymentsPerPage = 6;

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const [reloadTrigger, setReloadTrigger] = useState(false);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("search");

    if (savedSearch) setSearch(savedSearch);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerCourseReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("paymentCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerPaymentReload", handleReload);

    return () => {
      window.removeEventListener("triggerPaymentReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // **Effect 3: Lọc khóa học từ cache và phân trang khi cache thay đổi**
  useEffect(() => {
    if (!cache.has("ALL-DATA")) return;

    let filteredPayments = cache.get("ALL-DATA");

    // Lọc theo search
    if (search.trim() !== "") {
      filteredPayments = filteredPayments.filter((transactions) =>
        transactions.user.username
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    // Phân trang
    const startIndex = currentPage * paymentsPerPage;
    const endIndex = startIndex + paymentsPerPage;
    const paginatedCourses = filteredPayments.slice(startIndex, endIndex);

    setTransactions(paginatedCourses.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredPayments.length / paymentsPerPage));
    setLoading(false);
  }, [cache, search, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchPayments();
  }, [cache, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const cacheKey = `${search.trim()}`;

      let fetchedPayments;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedPayments = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getPaymentByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedPayments = data.data.content;

        // Lọc theo search
        if (search.trim() !== "") {
          fetchedPayments = fetchedPayments.filter((transaction) =>
            transaction.user.username
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-DATA";
        if (!cache.has(ALL_KEY)) {
          const data = await getPaymentByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allCourses = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allCourses));
          setCache(newCache);
          localStorage.setItem(
            "paymentCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        const newCache = new Map(cache.set(cacheKey, fetchedPayments));
        setCache(newCache);
        localStorage.setItem(
          "paymentCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedPayments.length === 0 && search.trim() !== "") {
        toast.info("No courses found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
      const startIndex = currentPage * paymentsPerPage;
      const endIndex = startIndex + paymentsPerPage;
      const paginatedCourses = fetchedPayments.slice(startIndex, endIndex);

      setTransactions(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedPayments.length / paymentsPerPage));
    } catch (error) {
      console.error("Error loading courses:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("search", search);
  }, [search]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("paymentCache");
    const savedNewPayments = localStorage.getItem("newPayments");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewPayments) {
        const newPayments = JSON.parse(savedNewPayments);
        const key = `${search.trim()}`;

        const updatedCourses = [
          ...(parsedCache.get(key) || []),
          ...newPayments,
        ];
        parsedCache.set(key, updatedCourses);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "paymentCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newPayments");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("payment")) {
      setSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname
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

  const fetchTransaction = (page = 0, size = 6) => {
    setLoading(true);
    axios
      .get(`${URL}/payments/page?page=${page}&size=${size}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTransactions(response.data?.data.content);
        setLoading(false);
      })

      .catch((error) => {
        console.log("Error get transaction " + error.message);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   fetchTransaction();
  //   if (keyword != null) {
  //     handleSearch();
  //   }
  // }, []);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchCourses();
  };

  // const handleSearch = () => {
  //   axios
  //     .get(`${URL}/payments/search?keyword=${keyword}`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       setTransactions(response.data.data);
  //       if (keyword == "") {
  //         fetchTransaction();
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error get transaction " + error.message);
  //     });
  // };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        {/* Header */}
        <div className="flex mb-2 items-center justify-between">
          <div className="flex h-12 items-center mx-2 gap-2 dark:text-darkText">
            <MdPayment size={isMobile ? 50 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-4xl lg:text-lg font-bold">
              {t("payment.title")}
            </h2>
          </div>
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

          <button
            type="submit"
            className="bg-wcolor lg:text-base text-3xl hover:bg-tcolor dark:hover:bg-darkHover dark:bg-darkSubbackground dark:border-darkBorder border-2 whitespace-nowrap px-4 py-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor px-2 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("user.username")}</th>
                  <th className="p-2">{t("payment.amount")} (VNĐ)</th>
                  <th className="p-2">{t("payment.coin")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("createdDate")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <DataTableSkeleton rows={6} cols={8} />
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {t("payment.noTranstraction")}
                    </td>
                  </tr>
                ) : (
                  Array.isArray(transactions) &&
                  transactions.map((t, index) => (
                    <tr
                      key={t.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">{index + 1 + currentPage * paymentsPerPage}</td>
                      <td className="p-2">{t.user?.username || "Unknown"}</td>
                      <td className="p-2">{t.amount.toLocaleString()}₫</td>
                      <td className="p-2">{t.coinAmount}</td>
                      <td className="p-2">{t.status}</td>
                      <td className="p-2">
                        {t.date
                          ? new Date(
                              t.date[0],
                              t.date[1] - 1,
                              t.date[2],
                              t.date[3],
                              t.date[4],
                              t.date[5]
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <Link
                          to={`/admin/transactions/view-payment/${t.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-600 hover:bg-opacity-80 text-white"
                        >
                          <FaEye />
                        </Link>
                        {/* {t.deleted === true ? (
                          <button
                            onClick={() => handleRestore(t.id)}
                            className="p-2 border-2 dark:border-darkBorder rounded bg-green-600 hover:bg-green-500 text-white"
                            title="Khôi phục giao dịch"
                          >
                            <FaLock />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            title="Khoá giao dịch"
                          >
                            <FaLockOpen />
                          </button>
                        )} */}
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
          <div className="space-x-2">
            <button
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={isMobile ? 55 : 30} />
            </button>
            <button
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <MdNavigateNext size={isMobile ? 55 : 30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
