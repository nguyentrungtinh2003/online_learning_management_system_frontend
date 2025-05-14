import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Sidebar/AdminSidebar";
import Navbar from "../Navbar/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen dark:bg-darkBackground">
          <div className="flex flex-col flex-1 bg-black">
          <Navbar/>
          <div className="flex flex-1 bg-cyan-50 dark:bg-darkBackground gap-2 p-2 h-full overflow-y-auto">
            <AdminSidebar />
            <main className="h-full w-full flex overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        </div>
  );
};

export default AdminLayout;
