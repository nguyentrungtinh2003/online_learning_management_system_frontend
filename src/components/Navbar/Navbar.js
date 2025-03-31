import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { PiBellRinging } from "react-icons/pi";
import URL from "../../config/URLconfig";
import axios from "axios";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchUserInfo();
    fetchUserGoogle();
    fetchNotifications();
  }, []);

  const fetchUserGoogle = () => {
    axios
      .get(`${URL}/user-google`, { withCredentials: true })
      .then((response) => {
        const { id, email, name, picture } = response.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
      })
      .catch(() => {});
  };

  const fetchUserInfo = () => {
    axios
      .get(`${URL}/user-info`, { withCredentials: true })
      .then((response) => {
        const { id, email, name, picture } = response.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
      })
      .catch(() => {});
  };

  // Lấy danh sách thông báo
  const fetchNotifications = () => {
    axios
      .get(`${URL}/notifications`, { withCredentials: true })
      .then((response) => {
        setNotifications(response.data.notifications);
        // Đếm số lượng thông báo chưa đọc
        const unread = response.data.notifications.filter(
          (n) => !n.read
        ).length;
        setUnreadCount(unread);
      })
      .catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });
  };

  // Toggle dropdown user
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false); // Đóng dropdown thông báo nếu đang mở
  };

  // Toggle dropdown thông báo
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false); // Đóng dropdown user nếu đang mở
    if (!isNotificationOpen) {
      setUnreadCount(0); // Đánh dấu tất cả thông báo đã đọc khi mở dropdown
    }
  };

  // Xử lý click ngoài dropdown để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };

    if (isDropdownOpen || isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isNotificationOpen]);

  const handleLogout = async () => {
    try {
      await axios.get(`${URL}/logout/google`, { withCredentials: true });
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="px-4 py-3 flex-1">
      <div className="flex justify-between items-center">
        {/* Search Bar */}
        <div className="flex-1 flex justify-center w-full ml-4 relative">
          <div className="flex w-[50%] justify-center gap-2 items-center border p-2 rounded-xl">
            <FaSearch className="text-gray-500 cursor-pointer" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* User & Notifications */}
        <div className="relative flex items-center gap-4">
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <div
              className="relative cursor-pointer"
              onClick={toggleNotificationDropdown}
            >
              <PiBellRinging
                size={38}
                className="hover:bg-focolor p-1 rounded-xl"
              />
              {unreadCount > 0 && (
                <span className="absolute top-4 left-6 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Dropdown Thông Báo */}
            {isNotificationOpen && (
              <div className="absolute right-0 w-[600px] p-2 mt-2 bg-white border rounded-xl shadow-lg z-20">
                <h3 className="text-lg w-full text-center font-semibold border-b pb-2">
                  Thông báo
                </h3>
                <ul className="py-2 h-[40%] overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li
                        key={index}
                        className={`hover:bg-focolor px-4 py-2 cursor-pointer break-words ${
                          !notification.read
                            ? "font-bold text-black"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </li>
                    ))
                  ) : (
                    <div>
                      <li className="hover:bg-focolor px-4 py-2 text-gray-500 break-words">
                        Bạn được tặng 2 điểm sau khi hoàn thành khóa học.
                      </li>
                      <li className="hover:bg-focolor px-4 py-2 text-gray-500 break-words">
                        Van Tan đã gửi cho bạn tin nhắn.
                      </li>
                      <li className="hover:bg-focolor px-4 py-2 text-gray-500 break-words">
                        Đăng kí khóa học JavaScript thành công.
                      </li>
                      <li className="hover:bg-focolor px-4 py-2 text-gray-500 break-words">
                        Chúc mừng bạn vừa thăng cấp thành công.
                      </li>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div ref={dropdownRef} className="relative">
            {localStorage.getItem("username") ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={localStorage.getItem("img")}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-600">
                  {localStorage.getItem("username")}
                </span>
              </div>
            ) : (
              <button className="bg-fcolor hover:bg-scolor text-lg text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
                <Link to="/login" className="no-underline text-white">
                  Start Learning
                </Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
