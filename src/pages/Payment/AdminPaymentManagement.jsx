import { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { FaLock, FaLockOpen } from "react-icons/fa";

import { Link } from "react-router-dom";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import URL from "../../config/URLconfig";
import axios from "axios";

export default function TransactionAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [keyword, setKeyword] = useState("");

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
    <div className="h-full w-full dark:text-darkText">
      <ToastContainer />
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold">Transaction Management</h2>
        <Link to="/admin/transactions/add">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:scale-105">
            Add Transaction
          </button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          className="border px-3 py-2 rounded w-full"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          // value={statusFilter}
          // onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All</option>
          <option value="Deleted">Deleted</option>
          <option value="Active">Active</option>
        </select>
      </div>

      <div className="bg-white dark:bg-darkSubbackground rounded-xl p-4 shadow">
        {transactions?.length === 0 ? (
          <p className="text-center">No transactions found.</p>
        ) : (
          <table className="w-full table-auto text-center">
            <thead>
              <tr className="font-bold border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Username</th>
                <th className="p-2">Amount (VNĐ)</th>
                <th className="p-2">Coin Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Deleted</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(transactions) &&
                transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{t.id}</td>
                    <td className="p-2">{t.user?.username || "Unknown"}</td>
                    <td className="p-2">{t.amount.toLocaleString()}₫</td>
                    <td className="p-2">{t.coinAmount}</td>
                    <td className="p-2">{t.status}</td>
                    <td className="p-2">
                      {new Date(t.date).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-2">{t.deleted === true ? "Yes" : "No"}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <Link to={`/admin/transactions/edit/${t.id}`}>
                        <Edit className="text-blue-600 cursor-pointer" />
                      </Link>
                      {t.deleted === true ? (
                        <button onClick={() => handleRestore(t.id)}>
                          <FaLock className="text-red-600" />
                        </button>
                      ) : (
                        <button onClick={() => handleDelete(t.id)}>
                          <FaLockOpen className="text-blue-600" />
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
  );
}
