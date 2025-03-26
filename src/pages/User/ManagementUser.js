import { useState, useEffect } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaUserPlus,
} from "react-icons/fa";
import { MdNavigateNext, MdDeleteForever } from "react-icons/md";
import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/user/all`, { withCredentials: true })
      .then((response) => {
        setUsers(response.data.data);
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
  }, []);

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Bạn có muốn xoá người dùng ${name} không ?`)) {
      axios
        .delete(`${URL}/user/delete/${id}`, { withCredentials: true })
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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen py-6 px-3">
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
          className="cursor-pointer hover:text-wcolor text-wcolor bg-fcolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl"
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
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <tr key={index} className="text-center animate-pulse">
                    {Array(8)
                      .fill(null)
                      .map((_, i) => (
                        <td key={i} className="p-2">
                          <div className="h-8 w-full my-1 bg-gray-300 rounded mx-auto"></div>
                        </td>
                      ))}
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
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
                    <td className="p-2">{user.rankEnum}</td>
                    <td className="p-2">
                      {user.statusUserEnum === "ACTIVE" ? (
                        <div className="flex justify-center items-center gap-1">
                          <FaCheckCircle className="text-green-500" />
                          <p>Online</p>
                        </div>
                      ) : (
                        <div className="justify-center items-center gap-1">
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
    </div>
  );
}
