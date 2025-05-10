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
    <div className="h-full w-full flex flex-col">
      <ToastContainer />
      <div className="flex mb-2 items-center justify-between">
        <div className="flex gap-2 dark:text-darkText items-center">
          <FaUsers size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("user.title")}</h2>
        </div>
        <Link
          className="cursor-pointer hover:text-wcolor text-wcolor bg-fcolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl"
          to="/admin/users/add-user"
        >
          <FaUserPlus size={30} />
        </Link>
      </div>
      {/* User Table */}
      <div className="flex-1 drop-shadow-lg">
        <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground p-4 rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="text-center dark:text-darkText font-bold">
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
                    className="text-center dark:text-darkSubtext"
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
        <p>
          {t("page")} {currentPage + 1} {t("of")} {totalPages}
        </p>
        <div className="space-x-2">
          <button
             className="bg-scolor p-1 rounded disabled:opacity-50"
            onClick={handlePrePage}
            disabled={currentPage === 0}
          >
            <MdNavigateBefore size={30} />
          </button>
          <button
             className="bg-scolor p-1 rounded disabled:opacity-50"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <MdNavigateNext size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
