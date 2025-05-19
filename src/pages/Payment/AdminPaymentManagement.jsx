import { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { FaLock,FaPlus, FaLockOpen } from "react-icons/fa";

import { Link } from "react-router-dom";
import { MdNavigateNext, MdNavigateBefore, MdPayment } from "react-icons/md";
import URL from "../../config/URLconfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function TransactionAdmin() {
  const { t } = useTranslation("adminmanagement");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [keyword, setKeyword] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 6;
  
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

  // const filteredTransactions = transactions.filter((t) => {
  //   const matchesSearch = t.user.username
  //     .toLowerCase()
  //     .includes(search.toLowerCase());
  //   const matchesStatus =
  //     statusFilter === "All" ||
  //     (statusFilter === "Deleted" && t.isDeleted) ||
  //     (statusFilter === "Active" && !t.isDeleted);
  //   return matchesSearch && matchesStatus;
  // });

  const fetchTransaction = (page = 0, size = 6) => {
    axios
      .get(`${URL}/payments/page?page=${page}&size=${size}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTransactions(response.data?.data.content);
      })
      .catch((error) => {
        console.log("Error get transaction " + error.message);
      });
  };

  useEffect(() => {
    fetchTransaction();
    if (keyword != null) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    axios
      .get(`${URL}/payments/search?keyword=${keyword}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTransactions(response.data.data);
        if (keyword == "") {
          fetchTransaction();
        }
      })
      .catch((error) => {
        console.log("Error get transaction " + error.message);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${URL}/payments/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        fetchTransaction();
      })
      .catch((error) => {
        console.log("Error get transaction " + error.message);
      });
  };

  const handleRestore = (id) => {
    axios
      .delete(`${URL}/payments/restore/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        fetchTransaction();
      })
      .catch((error) => {
        console.log("Error get transaction " + error.message);
      });
  };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <MdPayment size={isMobile ? 60 : 30}/>
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-5xl lg:text-lg font-bold">{t("payment.title")}</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/transactions/add">
            <button className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl">
              <FaPlus size={isMobile ? 50 : 30} />
            </button>
          </Link>
      </div>
      <div className="flex lg:h-12 h-24 gap-2 mb-2">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          // value={statusFilter}
          // onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-72 lg:w-48"
        >
          <option value="All">{t("all")}</option>
          <option value="Deleted">{t("deleted")}</option>
          <option value="Active">{t("active")}</option>
        </select>
      </div>

      <div className="flex-1 w-full overflow-auto overflow-x">
        <div className="bg-wcolor lg:px-2 px-4 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
        {transactions?.length === 0 ? (
          <p className="text-center">{t("payment.noTransaction")}</p>
        ) : (
          <table className="lg:w-full w-[200%] h-fit">
            <thead className="sticky top-0 z-10 dark:text-darkText">
              <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                <th className="p-2">{t("stt")}</th>
                <th className="p-2">{t("user.username")}</th>
                <th className="p-2">{t("payment.amount")} (VNĐ)</th>
                <th className="p-2">{t("payment.coin")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("createdDate")}</th>
                <th className="p-2">{t("deleted")}</th>
                <th className="p-2">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(transactions) &&
              transactions.map((t, index) => (
                <tr
                  key={t.id}
                  className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                >
                  <td className="p-2 lg:h-[8vh] h-[11vh]">{index + 1}</td>
                  <td className="p-2">{t.user?.username || "Unknown"}</td>
                  <td className="p-2">{t.amount.toLocaleString()}₫</td>
                  <td className="p-2">{t.coinAmount}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">
                    {new Date(t.date).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-2">
                    {t.deleted === true ? (
                      <span className="text-red-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-green-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-2 h-full items-center flex flex-1 justify-center">
                    <Link
                      to={`/admin/transactions/edit/${t.id}`}
                      className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                    >
                      <Edit />
                    </Link>
                    {t.deleted === true ? (
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
                    )}
                  </td>
                </tr>
              ))}
          </tbody>

          </table>
        )}
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
                  disabled={currentPage === 0}
                >
                  <MdNavigateBefore size={isMobile ? 55 : 30}  />
                </button>
                <button
                  className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <MdNavigateNext size={isMobile ? 55 : 30}  />
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}
