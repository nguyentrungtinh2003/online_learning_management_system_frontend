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

  const [searchQuery, setSearchQuery] = useState(""); // Lưu trữ giá trị nhập vào của search
  const [suggestions, setSuggestions] = useState([]); // Lưu trữ các gợi ý khóa học
  const [showSuggestions, setShowSuggestions] = useState(false); // Kiểm tra xem có nên hiển thị gợi ý hay không

  // Các gợi ý mặc định khi người dùng chưa nhập gì
  const defaultSuggestions = [
    { id: 1, name: "React for Beginners" },
    { id: 2, name: "Mastering JavaScript" },
    { id: 3, name: "HTML & CSS Fundamentals" },
    { id: 4, name: "Advanced React Patterns" },
    { id: 5, name: "Node.js and Express" },
  ];

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
        const { id, email, username, img } = response.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("img", img);
      })
      .catch(() => {});
  };

  const fetchNotifications = () => {
    axios
      .get(`${URL}/notifications`, { withCredentials: true })
      .then((response) => {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(
          (n) => !n.read
        ).length;
        setUnreadCount(unread);
      })
      .catch((error) => console.error("Failed to fetch notifications:", error));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      // Fetch search suggestions if input length > 2
      fetchSearchSuggestions(e.target.value);
    } else {
      setSuggestions([]); // Clear suggestions if input is less than 3 characters
    }
  };

  // Fetch search suggestions
  const fetchSearchSuggestions = (query) => {
    axios
      .get(`${URL}/search-courses?query=${query}`)
      .then((response) => {
        setSuggestions(response.data.suggestions);
      })
      .catch((error) => {
        console.error("Error fetching search suggestions:", error);
      });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
    if (!isNotificationOpen) {
      setUnreadCount(0);
    }
  };

  // Đóng form khi click bên ngoài
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

  // Hàm để hiển thị các gợi ý (có thể là mặc định hoặc từ API)
  const displaySuggestions = () => {
    if (searchQuery.length === 0) {
      // Nếu người dùng chưa nhập gì, hiển thị gợi ý mặc định
      return defaultSuggestions;
    }
    // Nếu người dùng đã nhập, hiển thị các gợi ý từ API
    return suggestions;
  };

  const handleFocus = () => {
    // Khi người dùng focus vào ô input, hiển thị các gợi ý mặc định
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Khi người dùng blur khỏi ô input, ẩn các gợi ý
    setShowSuggestions(false);
  };

  return (
    <nav className="px-4 py-3 flex-1">
      <div className="flex justify-between items-center">
        {/* Search Bar */}
        <div className="flex-1 flex justify-center w-full ml-4">
          <div className="flex w-[50%] justify-center gap-2 items-center border p-2 rounded-xl relative">
            <FaSearch className="text-gray-500 cursor-pointer" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus} // Khi focus vào input
              onBlur={handleBlur} // Khi blur khỏi input
              className="w-full text-sm focus:outline-none"
            />
            {(showSuggestions || searchQuery.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg py-2 z-10">
                <ul className="max-h-60 overflow-auto">
                  {displaySuggestions().map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <Link
                        to={`/course/${suggestion.id}`}
                        className="text-black"
                      >
                        {suggestion.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div ref={dropdownRef} className="relative items-center gap-2">
          {localStorage.getItem("username") ? (
            <div className="flex items-center gap-2">
              <div ref={notificationRef} className="relative">
                <div
                  className="relative cursor-pointer"
                  onClick={toggleNotificationDropdown}
                >
                  <PiBellRinging
                    size={38}
                    className="hover:bg-focolor p-1 rounded-xl"
                  />
                  {unreadCount >= 0 && (
                    <span className="absolute top-4 left-6 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
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
            </div>
          ) : (
            <button className="bg-fcolor hover:bg-scolor text-lg text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
              <Link to="/login" className="no-underline text-white">
                Start Learning
              </Link>
            </button>
          )}
          {isDropdownOpen && (
            <div className="absolute right-0 top-10 mt-2 bg-white border rounded-lg shadow-lg z-20">
              <ul className="py-2 whitespace-nowrap">
                <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">
                  <Link to="/profile">Thông tin tài khoản</Link>
                </li>
                <li
                  className="px-4 py-2 text-red-600 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </li>
              </ul>
            </div>
          )}
          {isNotificationOpen && (
            <div className="absolute right-0 top-10 w-[600px] p-2 mt-2 bg-white border rounded-xl shadow-lg z-20">
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
                  <li className="hover:bg-focolor px-4 py-2 text-gray-500 break-words">
                    Không có thông báo nào.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
