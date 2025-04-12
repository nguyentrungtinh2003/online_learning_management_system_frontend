import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

const AdminUpdateUser = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/api/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    if (imgFile) {
      formData.append("img", imgFile);
    }

    try {
      await axios.put(`${URL}/api/users/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <div className="p-6">Loading user data...</div>;
  if (!userData) return <div className="p-6 text-red-500">User not found!</div>;

  return (
    <div className="flex-1">
      <div className="flex flex-col h-fit py-6 px-3">
        <AdminNavbar />
        <div className="flex gap-2 mb-4 items-center">
          <FaBuffer size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">User Management</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">Edit User</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-4">
            {Object.keys(userData).map((key) =>
              key !== "rank" && key !== "img" ? (
                <div key={key} className="flex items-center space-x-4">
                  <label className="w-1/4 text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </label>
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={key}
                    value={userData[key] || ""}
                    onChange={handleChange}
                    readOnly={key === "userId"}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  />
                </div>
              ) : null
            )}
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Image:</label>
              <input
                type="file"
                name="img"
                onChange={handleImageChange}
                className="flex-1 border rounded-lg px-2 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Rank:</label>
              <select
                name="rank"
                value={userData.rank}
                onChange={handleChange}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/users"
              className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-wcolor rounded-lg hover:bg-opacity-80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateUser;
