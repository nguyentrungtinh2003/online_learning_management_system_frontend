import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdMessage,
  MdPayment,
} from "react-icons/md";
import {
  FaBuffer,
  FaUsers,
  FaHome,
  FaUser,
  FaTrophy,
  FaVideo,
  FaWallet,
  FaClipboardList,
} from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowLeft, MdMenu } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation("sidebar");
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminItems = [
    { id: "Dashboard", label: t("dashboard"), icon: <MdDashboardCustomize size={25} />, path: "/admin/" },
    { id: "Courses", label: t("courses"), icon: <FaBuffer size={25} />, path: "/admin/courses" },
    { id: "Lessons", label: t("lessons"), icon: <FaVideo size={25} />, path: "/admin/lessons" },
    { id: "Quizzes", label: t("quizzes"), icon: <FaClipboardList size={25} />, path: "/admin/quizzes" },
    { id: "Users", label: t("users"), icon: <FaUsers size={25} />, path: "/admin/users" },
    { id: "Payments", label: t("payments"), icon: <MdPayment size={25} />, path: "/admin/payment" },
    { id: "Blog", label: t("blog"), icon: <MdForum size={25} />, path: "/admin/blog" },
    { id: "Settings", label: t("settings"), icon: <MdSettingsSuggest size={25} />, path: "/admin/settings" },
  ];

  const userItems = [
    { id: "Home", label: t("home"), icon: <FaHome size={25} />, path: "/" },
    { id: "MyCourses", label: t("myCourses"), icon: <FaBuffer size={25} />, path: "/user-course" },
    { id: "Blog", label: t("blog"), icon: <MdForum size={25} />, path: "/blog" },
    { id: "Ranking", label: t("ranking"), icon: <FaTrophy size={25} />, path: "/ranking" },
    { id: "Profile", label: t("profile"), icon: <FaUser size={25} />, path: "/profile" },
    { id: "E-Wallet", label: t("eWallet"), icon: <FaWallet size={25} />, path: "/user/payment" },
    { id: "Chatting", label: t("chatting"), icon: <MdMessage size={25} />, path: "/chat" },
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
  };

  const handleCollapseToggle = () => {
    setIsAnimating(true);
    setIsCollapsed(!isCollapsed);
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };

  // Sidebar dạng NẰM NGANG ở mobile
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 py-3 right-0 z-50 bg-wcolor dark:bg-darkBackground shadow-inner border-t dark:border-darkBorder flex justify-around items-center h-36">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id, item.path)}
            className={`flex flex-col items-center w-full h-full justify-center gap-1 text-xl ${
              activeItem === item.id ? "bg-scolor text-wcolor px-4 py-2 rounded font-bold" : "px-4 py-2 text-fcolor"
            }`}
          >
            {item.icon}
            <span className="">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Sidebar DỌC cho desktop như cũ
  return (
    <div
      className={`h-full border-box shadow rounded-2xl dark:border-2 dark:border-darkBorder light:bg-white drop-shadow-lg p-4 transition-all duration-200 z-40 ${
        isCollapsed ? "w-[90px]" : "w-56"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        {!isCollapsed && !isAnimating && (
          <h2 className="flex-1 text-center text-xl font-bold text-fcolor">
            {localStorage.getItem("systemName")}
          </h2>
        )}
        <button
          className="p-2 rounded-md text-fcolor hover:bg-tcolor"
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
            className={`p-2 rounded font-bold cursor-pointer flex items-center gap-3 transition-all duration-500 relative 
              ${activeItem === item.id ? "bg-scolor" : "hover:bg-tcolor"}`}
            onClick={() => handleNavigate(item.id, item.path)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span
              className={`${
                activeItem === item.id ? "!text-wcolor" : "text-fcolor"
              }`}
            >
              {item.icon}
            </span>
            {!isCollapsed && !isAnimating && (
              <span
                className={`duration-1000 ${
                  activeItem === item.id ? "!text-wcolor" : "text-fcolor"
                }`}
              >
                {item.label}
              </span>
            )}
            {isCollapsed && (
              <div
                className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-wcolor whitespace-nowrap text-sm border-2 rounded-md py-2 px-3 
                transition-all duration-300 z-50 ${
                  hoveredItem === item.id
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <span className="text-fcolor">{item.label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
