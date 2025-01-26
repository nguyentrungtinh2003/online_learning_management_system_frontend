import React from "react";
import { FaBook, FaGraduationCap, FaUser, FaHome } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-white shadow-lg w-64 flex flex-col">
        {/* Logo and Menu Button */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="mr-3"
            />
            <span className="font-bold text-lg text-blue-900">Code Arena</span>
          </div>
          <button className="text-blue-500 text-2xl">
            <FiMenu />
          </button>
        </div>
        {/* Menu Items */}
        <nav className="flex-1 px-4 mt-4">
          {/* Dashboard */}
          <div className="hover:bg-blue-100 rounded-lg flex items-center gap-3 p-2 mb-4 cursor-pointer">
            <FaHome className="text-blue-500" />
            <span className="text-blue-500 font-semibold">Dashboard</span>
          </div>
          {/* Records */}
          <div className="hover:bg-blue-100 rounded-lg flex items-center gap-3 p-2 mb-4 cursor-pointer">
            <HiOutlineDocumentText className="text-blue-500" />
            <span className="text-blue-500 font-semibold">Records</span>
          </div>
          {/* Books */}
          <div className="flex items-center gap-3 p-2 mb-4 cursor-pointer hover:bg-blue-100 rounded-lg">
            <FaBook className="text-blue-500" />
            <span className="text-blue-500">Books</span>
          </div>
          {/* Students */}
          <div className="flex items-center gap-3 p-2 mb-4 cursor-pointer hover:bg-blue-100 rounded-lg">
            <FaGraduationCap className="text-blue-500" />
            <span className="text-blue-500">Students</span>
          </div>
          {/* Users */}
          <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-blue-100 rounded-lg">
            <FaUser className="text-blue-500" />
            <span className="text-blue-500">Users</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
