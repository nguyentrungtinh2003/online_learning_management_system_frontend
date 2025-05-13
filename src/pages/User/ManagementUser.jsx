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
    <div className="h-full dark:border-darkBorder dark:border bg-wcolor drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <ToastContainer />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
        <div className="flex mx-2 gap-2 dark:text-darkText">
          <FaUsers size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("user.title")}</h2>
        </div>
        <Link
          className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl"
          to="/admin/users/add-user"
        >
          <FaUserPlus size={30} />
        </Link>
      </div>
      {/* User Table */}
      <div className="flex-1 py-2">
       <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-y text-center dark:text-darkText whitespace-nowrap font-bold">
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
                [...Array(1)].map((_, index) => (
                  <DataTableSkeleton key={index} />
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    {t("user.noUserFound")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="text-center border-b hover:bg-tcolor dark:hover:bg-darkHover"
                  >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phoneNumber}</td>
                    <td className="p-2">{user.point}</td>
                    <td className="p-2">{user.rankEnum}</td>
                    <td className="p-2">
                      {!user.deleted ? (
                        <div className="flex justify-center items-center gap-1">
                          <FaCheckCircle className="text-green-500" />
                          <p></p>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-1">
                          <FaTimesCircle className="text-red-500" />
                          <p></p>
                        </div>
                      )}
                    </td>
                    <td className="p-2 flex justify-center gap-1">
                      <button
                        className="p-2 border rounded"
                        onClick={() =>
                          (window.location.href = `/admin/users/edit-user/${user.id}`)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 border rounded text-red-600"
                        onClick={() => handleDeleteUser(user.id, user.username)}
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
      <div className="flex dark:text-darkText items-center justify-between">
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
            <MdNavigateBefore size={30} />
          </button>
          <button
            className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <MdNavigateNext size={30} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
