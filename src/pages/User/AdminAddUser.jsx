import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { FaUsers } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { ToastContainer, toast, Slide } from "react-toastify";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDay: "",
    address: "",
    roleEnum: "STUDENT", // Default value
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "user",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (image) {
      data.append("img", image);
    }

    await axios
      .post(`${URL}/api/auth/admin-register-user`, data)
      .then(() => {
        toast.success("User added successfully!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        setTimeout(() => {
          window.location.replace("/admin/users");
        }, 3000);
      })
      .catch(() => {
        toast.error("Failed to add user!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      });
  };

  return (
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col h-fit p-6">
        <div className="flex gap-2 items-center">
          <FaUsers size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">User Management</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold ">Add New User</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white py-6 px-3 rounded-lg shadow mt-4"
        >
          <div className="space-y-4">
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Password", name: "password", type: "password" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone Number", name: "phoneNumber", type: "text" },
              { label: "Birth Day", name: "birthDay", type: "date" },
              { label: "Address", name: "address", type: "text" },
            ].map((field) => (
              <div key={field.name} className="flex items-center space-x-4">
                <label className="w-1/4 text-gray-700 font-medium">
                  {field.label}:
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  required
                />
              </div>
            ))}

            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Role:</label>
              <select
                name="roleEnum"
                value={formData.roleEnum}
                onChange={handleInputChange}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">LECTURE</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Profile Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 border rounded-lg px-2 py-2"
              />
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
      <ToastContainer />
    </div>
  );
};

export default AdminAddUser;
