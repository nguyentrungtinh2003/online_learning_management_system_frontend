import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
} from "react-icons/md";
import { FaBuffer, FaUsers } from "react-icons/fa";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate(); // Hook điều hướng

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

  const handleNavigate = (id, path) => {
    setActiveItem(id);
    navigate(path);
  };

  return (
    <div className="w-64 bg-white drop-shadow-lg p-4 mx-2 my-4 rounded-2xl font-semibold">
      <h2 className="text-xl font-bold mb-4 text-center">Code Arena</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`p-2 rounded font-bold cursor-pointer flex items-center gap-3 transition-colors ${
              activeItem === item.id
                ? "bg-scolor text-ficolor scale-105"
                : "hover:bg-tcolor duration-500"
            }`}
            onClick={() => handleNavigate(item.id, item.path)}
          >
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
