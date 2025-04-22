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
  const [isAnimating, setIsAnimating] = useState(false); // New state to handle animation

  const adminItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: <MdDashboardCustomize size={25} />,
      path: "/admin/",
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
      path: "/user-course",
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
    const matchedItem = menuItems
      .filter((item) => location.pathname.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0];

    setActiveItem(matchedItem ? matchedItem.id : "");
  }, [location.pathname, isAdmin]);

  const handleNavigate = (id, path) => {
    setActiveItem(id);
    navigate(path);
    setIsOpen(false);
  };

  const handleCollapseToggle = () => {
    setIsAnimating(true); // Set isAnimating to true when starting animation
    setIsCollapsed(!isCollapsed);

    // Set a timeout to reset the animation state once animation finishes (e.g., after 300ms)
    setTimeout(() => {
      setIsAnimating(false); // Reset animation state
    }, 100); // Adjust timing to match the duration of your sidebar's animation
  };

  return (
    <div className="h-screen flex p-2">
      <div
        className={`h-full rounded-2xl bg-white drop-shadow-lg p-4 transition-all duration-200 z-40 ${
          isCollapsed ? "w-[90px]" : "w-56"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          {/* Only show the "Code Arena" title when sidebar is expanded and not animating */}
          {!isCollapsed && !isAnimating && (
            <h2 className="flex-1 text-center text-xl font-bold text-fcolor">
              Code Arena
            </h2>
          )}
          <button
            className="p-2 rounded-md text-fcolor hover:bg-gray-200"
            onClick={handleCollapseToggle}
          >
            {isCollapsed ? (
              <MdMenu
                size={25}
                className={`transition-transform duration-500 ${
                  isCollapsed ? "rotate-180" : "rotate-0"
                }`}
              />
            ) : (
              <MdOutlineKeyboardDoubleArrowLeft size={25} />
            )}
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`p-2 rounded font-bold cursor-pointer flex items-center gap-3 transition-all duration-500 relative group ${
                activeItem === item.id
                  ? "bg-fcolor hover:bg-fcolor text-wcolor"
                  : "hover:bg-tcolor text-fcolor"
              }`}
              onClick={() => handleNavigate(item.id, item.path)}
            >
              {item.icon}
              {!isCollapsed && !isAnimating && (
                <span className="duration-1000">{item.label}</span>
              )}
              {isCollapsed && (
                <div
                  className="absolute left-full ml-2 whitespace-nowrap 
                    bg-scolor text-white text-sm rounded-md py-1 px-2 opacity-0 scale-90 
                    group-hover:opacity-100 group-hover:scale-100 transition-all duration-600"
                >
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
