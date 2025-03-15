import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FaBuffer, FaUsers } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false); // Thêm trạng thái mở/tắt Sidebar

  const menuItems = [
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

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveItem("Dashboard");
      navigate("/admin/dashboard");
      return;
    }

    if (location.pathname.startsWith("/admin/blog/")) {
      setActiveItem("Blog");
    } else if (location.pathname.startsWith("/admin/courses/")) {
      setActiveItem("Courses");
    } else if (location.pathname.startsWith("/admin/users/")) {
      setActiveItem("Users");
    } else {
      const matchedItem = menuItems.find(
        (item) => location.pathname === item.path
      );
      setActiveItem(matchedItem ? matchedItem.id : "Dashboard");
    }
  }, [location.pathname, navigate]);

  const handleNavigate = (id, path) => {
    setActiveItem(id);
    navigate(path);
    setIsOpen(false); // Tự động đóng Sidebar trên mobile khi chọn mục
  };

  return (
    <>
      {/* Nút mở menu trên mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-scolor p-2 rounded-md text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={25} /> : <MdMenu size={25} />}
      </button>

      {/* Sidebar */}
      <div
        className={`ml-2 fixed lg:relative lg:h-screen top-0 left-0 h-fit w-64 bg-white drop-shadow-lg p-4 rounded-2xl font-semibold transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-64 lg:block`}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Code Arena</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`p-2 rounded font-bold cursor-pointer flex items-center gap-3 transition-all duration-300 
              ${
                activeItem === item.id
                  ? "bg-scolor text-ficolor scale-105"
                  : "hover:bg-tcolor"
              }
              `}
              onClick={() => handleNavigate(item.id, item.path)}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
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
    </>
  );
}
