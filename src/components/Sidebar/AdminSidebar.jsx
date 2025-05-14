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
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar() {
  const { t } = useTranslation("sidebar");
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const protectedRoutes = {
    "/user-course": ["STUDENT", "ADMIN", "TEACHER"],
    "/user/payment": ["STUDENT", "ADMIN", "TEACHER"],
    "/chat": ["STUDENT", "ADMIN", "TEACHER"],
    "/profile": ["STUDENT", "ADMIN", "TEACHER"],
  };

  const hasPermission = (path) => {
    const userRoles = localStorage.getItem("role");
    const requiredRoles = protectedRoutes[path];
    if (!requiredRoles) return true;
    if (!userRoles) return false; // Không có role -> chưa đăng nhập => không cho truy cập
    return requiredRoles.some((role) => userRoles.includes(role));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminItems = [
    {
      id: "Dashboard",
      label: t("dashboard"),
      icon: <MdDashboardCustomize size={isMobile ? 35 : 25} />,
      path: "/admin",
    },
    {
      id: "Courses",
      label: t("courses"),
      icon: <FaBuffer size={isMobile ? 35 : 25} />,
      path: "/admin/courses",
    },
    {
      id: "Lessons",
      label: t("lessons"),
      icon: <FaVideo size={isMobile ? 35 : 25} />,
      path: "/admin/lessons",
    },
    {
      id: "Quizzes",
      label: t("quizzes"),
      icon: <FaClipboardList size={isMobile ? 35 : 25} />,
      path: "/admin/quizzes",
    },
    {
      id: "Users",
      label: t("users"),
      icon: <FaUsers size={isMobile ? 35 : 25} />,
      path: "/admin/users",
    },
    {
      id: "Payments",
      label: t("payments"),
      icon: <MdPayment size={isMobile ? 35 : 25} />,
      path: "/admin/payment",
    },
    {
      id: "Blog",
      label: t("blog"),
      icon: <MdForum size={isMobile ? 35 : 25} />,
      path: "/admin/blog",
    },
    {
      id: "Ranking",
      label: t("ranking"),
      icon: <FaTrophy size={isMobile ? 35 : 25} />,
      path: "/ranking",
    },
    {
      id: "Settings",
      label: t("settings"),
      icon: <MdSettingsSuggest size={isMobile ? 35 : 25} />,
      path: "/admin/settings",
    },
  ];

  const userItems = [
    {
      id: "Home",
      label: t("home"),
      icon: <FaHome size={isMobile ? 35 : 25} />,
      path: "/",
    },
    {
      id: "MyCourses",
      label: t("myCourses"),
      icon: <FaBuffer size={isMobile ? 35 : 25} />,
      path: "/user-course",
    },
    {
      id: "Blog",
      label: t("blog"),
      icon: <MdForum size={isMobile ? 35 : 25} />,
      path: "/blog",
    },
    {
      id: "Ranking",
      label: t("ranking"),
      icon: <FaTrophy size={isMobile ? 35 : 25} />,
      path: "/ranking",
    },
    {
      id: "Profile",
      label: t("profile"),
      icon: <FaUser size={isMobile ? 35 : 25} />,
      path: "/profile",
    },
    {
      id: "E-Wallet",
      label: t("eWallet"),
      icon: <FaWallet size={isMobile ? 35 : 25} />,
      path: "/user/payment",
    },
    {
      id: "Chatting",
      label: t("chatting"),
      icon: <MdMessage size={isMobile ? 35 : 25} />,
      path: "/chat",
    },
  ];

  const isAdmin = location.pathname.startsWith("/admin");
  const menuItems = isAdmin ? adminItems : userItems;

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems
      .filter((item) => currentPath.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0];
    setActiveItem(matchedItem ? matchedItem.id : "");

    // Kiểm tra quyền truy cập sau mỗi lần chuyển trang
    if (!hasPermission(currentPath)) {
      toast.warning("Bạn không có quyền truy cập vào trang này");
    }
  }, [location.pathname, menuItems]);  // Lắng nghe sự thay đổi của location


  const [lastClickTime, setLastClickTime] = useState(0);

  const handleNavigate = (id, path) => {
    const now = Date.now();
    if (now - lastClickTime < 300) return; // Tránh spam click

    setLastClickTime(now);

    if (isAnimating) return;
    if (!hasPermission(path)) {
      toast.warning("Bạn không có quyền truy cập vào trang này");
      return;
    }

    setActiveItem(id);
    navigate(path);
  };


  const handleCollapseToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsCollapsed(!isCollapsed);
    setTimeout(() => {
      setIsAnimating(false);
    }, 100); // nên khớp với thời gian animation thực tế
  };

  // Sidebar dạng NẰM NGANG ở mobile
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 py-2 right-0 z-50 bg-wcolor dark:bg-darkBackground shadow-inner border-t dark:border-darkBorder flex justify-around items-center h-36">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id, item.path)}
            className={`flex flex-col items-center w-full h-full items-center pt-8 h-[2.5rem] gap-1 text-xl ${
              activeItem === item.id
                ? "border-b-4 border-cyan-400 bg-gradient-to-b from-transparent to-[rgba(34,211,238,.1)] dark:to-[rgba(34,211,238,.1)] text-cyan-500"
                : "text-lightText hover:text-gray-900 hover:scale-105 border-gray-400 hover:border-b dark:text-darkSubtext hover:font-bold  dark:hover:text-darkText"
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
      className={`h-full bg-wcolor dark:bg-darkBackground border-box rounded-2xl border-1 dark:border-darkBorder light:bg-white drop-shadow-lg p-4 transition-all duration-200 z-40 ${
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
          className="p-2 rounded-md text-fcolor hover:bg-tcolor dark:hover:bg-darkHover"
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
            className={`p-2 font-bold ${
              isCollapsed === true ? "border-none bg-none" : ""
            } cursor-pointer flex items-center gap-2 duration-100 relative 
              ${
                activeItem === item.id
                  ? "border-r-4 border-cyan-400 bg-gradient-to-r from-transparent to-[rgba(34,211,238,.1)] dark:to-[rgba(34,211,238,.1)] text-cyan-500"
                  : "text-lightText hover:text-gray-900 hover:scale-105 border-gray-400 hover:border-r dark:text-darkSubtext hover:font-bold  dark:hover:text-darkText"
              }`}
            onClick={() => handleNavigate(item.id, item.path)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className={`${activeItem === item.id ? "" : ""}`}>
              {item.icon}
            </span>
            {!isCollapsed && !isAnimating && (
              <span
                className={`duration-1000 lg:text-base ${
                  activeItem === item.id ? "" : ""
                }`}
              >
                {item.label}
              </span>
            )}
            {isCollapsed && (
              <div
                className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground whitespace-nowrap text-sm border-2 rounded-md py-2 px-3 
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
