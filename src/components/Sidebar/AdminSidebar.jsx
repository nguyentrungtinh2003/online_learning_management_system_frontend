import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboardCustomize,
  MdForum,
  MdSettingsSuggest,
  MdMenu,
  MdOutlineKeyboardDoubleArrowLeft,
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
  FaQuestion
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // New state to handle animation
  const [hoveredItem, setHoveredItem] = useState(null); // State to track hovered item

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
      id: "Lessons",
      label: "Lessons",
      icon: <FaVideo size={25} />,
      path: "/admin/lessons",
    },
    {
      id: "Quizzes",
      label: "Quizzes",
      icon: <FaClipboardList size={25} />,
      path: "/admin/quizzes",
    },
    // {
    //   id: "Questions",
    //   label: "Questions",
    //   icon: <FaQuestion size={25} />,
    //   path: "/admin/questions",
    // },
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
      id: "E-Wallet",
      label: "E-Wallet",
      icon: <FaWallet size={25} />,
      path: "/user/payment",
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
    <div className="flex dark:bg-darkBackground">
      <div
        className={`h-full border-box shadow rounded-2xl dark:border-2 dark:border-darkBorder light:bg-white drop-shadow-lg p-4 transition-all duration-200 z-40 ${
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
                ${activeItem === item.id ? "bg-scolor" : "hover:bg-tcolor"}`
              }
              onClick={() => handleNavigate(item.id, item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
          
              {/* Apply 'fcolor' class to the icon */}
              <span className={`${activeItem === item.id ? "!text-wcolor" : "text-fcolor"}`}>{item.icon}</span>
              {!isCollapsed && !isAnimating && (
                 <span className={`duration-1000 ${activeItem === item.id ? "!text-wcolor" : "text-fcolor"}`}>{item.label}</span>
              )}
              {isCollapsed && (
                <div
                  className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-wcolor whitespace-nowrap text-sm border-2 rounded-md py-2 px-3 
                    transition-all duration-300 ${
                      hoveredItem === item.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-90"
                    }`}
                >
                  {/* Apply 'fcolor' class to the label */}
                  <span className="text-fcolor">{item.label}</span>
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
