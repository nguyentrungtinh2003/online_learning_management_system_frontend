import React from "react";
import Sidebar from "./Sidebar ";
import DashboardCard from "./DashboardCard";
import Chart from "./Chart";
import { Routes, Route, Link } from "react-router-dom";
import ManagementCourse from "../Course/ManagementCourse";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import ManagementUser from "../User/ManagementUser";
import AdminBlogManagement from "../Blog/AdminBlogManagement";
import Overview from "./Overview";
import AdminSettings from "./AdminSetting";

const Dashboard = () => {
  return (
    <div className="flex h-fit bg-focolor">
      <AdminSidebar />
      <Routes>
        <Route path="*" element={<Overview />} />
        <Route path="courses" element={<ManagementCourse />} />
        <Route path="users" element={<ManagementUser />} />
        <Route path="blog" element={<AdminBlogManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
