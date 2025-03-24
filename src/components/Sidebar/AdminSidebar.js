import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdMenu,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { FaBuffer, FaUsers, FaHome, FaUser, FaTrophy } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    setIsOpen(false);
  };

  return (
    <div className="h-screen flex">
      <div
        className={`h-full bg-white drop-shadow-lg p-4 transition-all duration-300 z-40 ${
          isCollapsed ? "w-30" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`flex-1 text-center text-xl font-bold text-fcolor transition-all duration-300 ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            Code Arena
          </h2>
          <button
            className="p-2 rounded-md text-fcolor hover:bg-gray-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <MdMenu size={25} />
            ) : (
              <MdOutlineKeyboardDoubleArrowLeft size={25} />
            )}
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`p-2 rounded font-bold hover:bg-fcolor cursor-pointer flex items-center gap-3 transition-all duration-300 relative group ${
                activeItem === item.id
                  ? "bg-fcolor text-wcolor scale-105"
                  : "bg-white text-fcolor"
              }`}
              onClick={() => handleNavigate(item.id, item.path)}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1 bg-scolor text-white text-xl rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
