import React from "react";
import { FaSearch, FaCog } from "react-icons/fa";

export default function AdminNavbar() {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex-1 justify-center flex">
        <div className="flex w-[40%] items-center gap-2 px-3 py-2 cursor-pointer rounded-2xl drop-shadow-lg group bg-white">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search ..."
            className="focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 w-fit inlined">
        <span className="text-fcolor font-semibold cursor-pointer">
          Welcome back!
        </span>
        <FaCog className="cursor-pointer" />
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <p>
          {localStorage.getItem("username")},{localStorage.getItem("id")}
        </p>
      </div>
    </div>
  );
}
