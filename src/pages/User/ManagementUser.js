import { useState, useEffect } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaEye,
  FaUserPlus,
} from "react-icons/fa";
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdDeleteForever,
} from "react-icons/md";
import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${"https://codearena-backend-dev.onrender.com"}/api/auth/all-user`)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu người dùng!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      });
  }, []);

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Bạn có muốn xoá người dùng ${name} không ?`)) {
      axios
        .delete(`${URL}/api/auth/delete-user/${id}`)
        .then(() => {
          toast.success("Xoá người dùng thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          setUsers(users.filter((user) => user.id !== id)); // Cập nhật danh sách user
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

  const getMedalColor = (rank) => {
    return rank === "BRONZE"
      ? "#cd7f32"
      : rank === "SILVER"
      ? "#c0c0c0"
      : rank === "GOLD"
      ? "#ffd700"
      : rank === "PLATINUM"
      ? "#e5e4e2"
      : rank === "DIAMOND"
      ? "#00c3ff"
      : "#ff4500";
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen p-6">
      <ToastContainer />

      {/* Header */}
      <AdminNavbar />

      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <FaUsers size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold mb-4">User Management</h2>
        </div>
        <Link
          className="cursor-pointer hover:text-ficolor bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl"
          to="/admin/users/add-user"
        >
          <FaUserPlus size={30} />
        </Link>
      </div>

      {/* User Table */}
      <div className="flex-1 drop-shadow-lg">
        <div className="bg-white p-4 rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="text-center font-bold">
                <th className="p-2">ID</th>
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Point</th>
                <th className="p-2">Rank</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phoneNumber}</td>
                    <td className="p-2">{user.point}</td>
                    <td className="p-2">
                      <span
                        className="px-2 py-1 rounded text-white"
                        style={{
                          backgroundColor: getMedalColor(user.rankEnum),
                        }}
                      >
                        {user.rankEnum}
                      </span>
                    </td>
                    <td className="p-2">
                      {user.statusUserEnum === "ACTIVE" ? (
                        <div className="flex items-center gap-1">
                          <FaCheckCircle className="text-green-500" />
                          <p>Online</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <FaTimesCircle className="text-red-500" />
                          <p>Offline</p>
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <p>Showing 1 of 4 pages</p>
        <div className="space-x-2">
          <button className="bg-scolor p-1 hover:scale-105 duration-500">
            <MdNavigateBefore size={30} />
          </button>
          <button className="bg-scolor p-1 hover:scale-105 duration-500 ">
            <MdNavigateNext size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
