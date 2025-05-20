import React, { useState, useEffect } from "react";

import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import { Link } from "react-router-dom";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
  const { t } = useTranslation("adminmanagement");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");

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

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${URL}/admin/user/page?page=${currentPage}&size=${usersPerPage}`, {
        withCredentials: true,
      })
      .then((response) => {
        const fetchedUsers = response.data.data.content;
        setUsers(fetchedUsers.sort((a, b) => b.id - a.id)); // sắp xếp theo ID
        setTotalPages(response.data.data.totalPages);
        setLoading(false);
      })

      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu người dùng!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        setLoading(false);
      });
  }, [currentPage]); // nhớ thêm currentPage vào dependencies

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Bạn có muốn xoá người dùng ${name} không ?`)) {
      axios
        .delete(`${URL}/admin/user/delete/${id}`, { withCredentials: true })
        .then(() => {
          toast.success("Xoá người dùng thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch(() => {
          toast.error("Lỗi khi xoá người dùng!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
        });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <FaUsers size={isMobile ? 50 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30}/>
            <h2 className="text-4xl lg:text-lg font-bold">{t("user.title")}</h2>
          </div>
        <Link
          className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl"
          to="/admin/users/add-user"
        >
          <FaUserPlus size={isMobile ? 50 : 30} />
        </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mb-2">
          {/* Ô tìm kiếm */}
          <div className="relative flex gap-2 h-24 lg:h-12 w-full">
            <input
              type="text"
              value={search}
              placeholder={t("searchPlaceholder")}
              className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setSearch("")}
              >
                <FaTimes size={18} />
              </button>
            )}
            {/* Select lọc theo vai trò */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setCurrentPage(0);
                setRoleFilter(e.target.value);
              }}
              className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-72 lg:w-48"
            >
              <option value="All">{t("all")}</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        {/* User Table */}
        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("user.username")}</th>
                  <th className="p-2">{t("user.email")}</th>
                  <th className="p-2">{t("user.phone")}</th>
                  <th className="p-2">{t("user.point")}</th>
                  <th className="p-2">{t("user.rank")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(1)].map((_, index) => <DataTableSkeleton key={index} />)
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      {t("user.noUserFound")}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * usersPerPage}
                      </td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.phoneNumber}</td>
                      <td className="p-2">{user.point}</td>
                      <td className="p-2">{user.rankEnum}</td>
                      <td className="p-2">
                        {!user.deleted ? (
                          <div className="flex justify-center items-center gap-1">
                            <FaCheckCircle className="text-green-500" />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1">
                            <FaTimesCircle className="text-red-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <Link
                          to={`/admin/users/edit-user/${user.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa người dùng"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                          title="Xoá người dùng"
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
