import React from "react";
import { Link } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = () => {
  return (
    <div className="bg-white text-black vh-100 p-2 flex flex-column border-r-2">
      {/* Tiêu đề */}
      <h5 className="mb-4 fw-bold text-uppercase text-center">Dashboard</h5>

      {/* Menu điều hướng */}
      <div>
        <Link to="/dashboard" className="flex items-center">
          <HomeIcon className="mr-2" />
          <p>Home</p>
        </Link>
        <Link to="" className="flex items-center">
          <GroupIcon className="mr-2" />
          <p>Users</p>
        </Link>
        <Link to="/all-user" className="flex items-center">
          <ManageAccountsIcon className="mr-2" />
          <p>Management</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
