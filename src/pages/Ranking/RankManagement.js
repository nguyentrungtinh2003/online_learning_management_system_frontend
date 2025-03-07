import { useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaBuffer,
  FaTimesCircle,
  FaSearch,
  FaCog,
  FaEdit,
  FaEye,
  FaUserPlus,
} from "react-icons/fa";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import Sidebar from "../Dashboard/Sidebar ";

const users = [
  {
    id: "001",
    username: "Van Tan",
    email: "vantan@gmail.com",
    phone: "033175623",
    image: "img1.jpg",
    coin: 300,
    point: 1200,
    rank: "Silver",
    status: "Online",
  },
  {
    id: "002",
    username: "Trung Tim",
    email: "trungtim@gmail.com",
    phone: "038214564",
    image: "img2.jpg",
    coin: 600,
    point: 1500,
    rank: "Diamond",
    status: "Online",
  },
  {
    id: "003",
    username: "Trong Hieu",
    email: "hieuink@gmail.com",
    phone: "096315426",
    image: "img3.jpg",
    coin: 700,
    point: 1800,
    rank: "Gold",
    status: "Offline",
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full p-6">
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
                  <th className="p-2">Image</th>
                  <th className="p-2">Coin</th>
                  <th className="p-2">Point</th>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">
                      <img
                        src={user.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mx-auto"
                      />
                    </td>
                    <td className="p-2">{user.coin}</td>
                    <td className="p-2">{user.point}</td>
                    <td className="p-2">{user.rank}</td>
                    <td className="p-2 place-items-center">
                      {user.status === "Online" ? (
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
                      <button className="p-2 border rounded">
                        <FaEye />
                      </button>
                      <button className="p-2 border rounded">
                        <FaEdit />
                      </button>
                      <button className="p-2 border rounded">
                        <MdDeleteForever />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-end full justify-between">
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
