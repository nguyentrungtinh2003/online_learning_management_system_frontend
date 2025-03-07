import { useState, useEffect } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaCog,
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
import Sidebar from "../Dashboard/Sidebar ";
import { ToastContainer, toast, Slide } from "react-toastify";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${URL}/api/auth/all-user`)
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
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full p-6">
        <ToastContainer />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 justify-center flex">
            <div className="flex w-[40%] items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl group bg-ficolor">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="focus:outline-none bg-ficolor"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-fit inlined">
            <span className="text-scolor cursor-pointer">Welcome back!</span>
            <FaCog className="cursor-pointer" />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <p>Admin</p>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <FaUsers size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold mb-4">User Management</h2>
          </div>
          <button className="cursor-pointer bg-fcolor px-8 py-2 rounded-xl">
            <FaUserPlus size={30} />
          </button>
        </div>

        {/* User Table */}
        <div className="flex-1">
          <div className="bg-ficolor p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-center font-bold">
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
                            (window.location.href = `/view-user/${user.id}`)
                          }
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-2 border rounded"
                          onClick={() =>
                            (window.location.href = `/admin-update-user/${user.id}`)
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 border rounded text-red-600"
                          onClick={() =>
                            handleDeleteUser(user.id, user.username)
                          }
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
            <button className="bg-fcolor p-1">
              <MdNavigateBefore size={30} />
            </button>
            <button className="bg-fcolor p-1">
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
