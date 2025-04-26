import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Sidebar/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex bg-focolor">
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
