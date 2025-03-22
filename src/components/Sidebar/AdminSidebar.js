import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FaBuffer, FaUsers, FaHome, FaUser, FaTrophy } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Menu dành cho Admin
  const adminItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: <MdDashboardCustomize size={25} />,
      path: "/admin/dashboard",
    },
    {
      id: "Courses",
      label: "Courses",
      icon: <FaBuffer size={25} />,
      path: "/admin/courses",
    },
    {
      id: "Users",
      label: "Users",
      icon: <FaUsers size={25} />,
      path: "/admin/users",
    },
    {
      id: "Blog",
      label: "Blog",
      icon: <MdForum size={25} />,
      path: "/admin/blog",
    },
    {
      id: "Settings",
      label: "Setting",
      icon: <MdSettingsSuggest size={25} />,
      path: "/admin/settings",
    },
  ];

  // Menu dành cho User
  const userItems = [
    { id: "Home", label: "Home", icon: <FaHome size={25} />, path: "/" },
    {
      id: "MyCourses",
      label: "My Courses",
      icon: <FaBuffer size={25} />,
      path: "/my-courses",
    },
    { id: "Blog", label: "Blog", icon: <MdForum size={25} />, path: "/blog" },
    {
      id: "Ranking",
      label: "Ranking",
      icon: <FaTrophy size={25} />,
      path: "/ranking",
    },
    {
      id: "Profile",
      label: "Profile",
      icon: <FaUser size={25} />,
      path: "/profile",
    },
    {
      id: "Settings",
      label: "Setting",
      icon: <MdSettingsSuggest size={25} />,
      path: "/settings",
    },
  ];

  // Xác định loại menu dựa trên đường dẫn
  const isAdmin = location.pathname.startsWith("/admin");
  const menuItems = isAdmin ? adminItems : userItems;

  useEffect(() => {
    const matchedItem = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    setActiveItem(
      matchedItem ? matchedItem.id : isAdmin ? "Dashboard" : "Home"
    );
  }, [location.pathname, isAdmin]);

  const handleNavigate = (id, path) => {
    setActiveItem(id);
    navigate(path);
    setIsOpen(false); // Đóng menu trên mobile khi chọn
  };

  return (
    <div className="h-screen p-3">
      {/* Nút mở menu trên mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-fcolor p-2 rounded-md text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={25} /> : <MdMenu size={25} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-full border-box top-0 left-0 h-fit bg-white drop-shadow-lg p-4 rounded-2xl font-semibold transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-64 lg:block`}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-fcolor">
          Code Arena
        </h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`p-2 rounded font-bold hover:bg-fcolor cursor-pointer flex items-center gap-3 transition-all duration-300 
              ${
                activeItem === item.id
                  ? "bg-fcolor text-wcolor scale-105"
                  : "bg-white text-fcolor"
              }
              `}
              onClick={() => handleNavigate(item.id, item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Background overlay khi mở menu trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
