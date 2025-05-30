import { Outlet } from "react-router-dom";
import AdminSidebar from "../Sidebar/AdminSidebar";
import Navbar from "../Navbar/Navbar";

export default function UserLayout() {
  return (
    <div className="flex h-screen dark:bg-darkBackground">
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="flex flex-1 gap-2 p-2 h-full mb-36 lg:mb-0 overflow-y-auto">
          <AdminSidebar />
          <main className="h-full w-full flex overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
