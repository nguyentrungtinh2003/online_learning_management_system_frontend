import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { PiBellRinging } from "react-icons/pi";
import URL from "../../config/URLconfig";
import axios from "axios";
import { FaCoins, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState(""); // Lưu trữ giá trị nhập vào của search
  const [suggestions, setSuggestions] = useState([]); // Lưu trữ các gợi ý khóa học
  const [showSuggestions, setShowSuggestions] = useState(false); // Kiểm tra xem có nên hiển thị gợi ý hay không
  const [isDarkMode, setIsDarkMode] = useState(false); // State cho dark mode

  // Lấy giá trị dark mode từ localStorage khi component load
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (isDarkMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
  };

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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/user-info`, {
        withCredentials: true,
      });
      const { id, email, username, img, coin } = response.data.data;
      localStorage.setItem("id", id);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);
      localStorage.setItem("img", img);
      localStorage.setItem("coin", coin);
    } catch (err1) {
      try {
        const googleResponse = await axios.get(`${URL}/user-google`, {
          withCredentials: true,
        });
        const { id, email, name, picture } = googleResponse.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
      } catch (err2) {
        console.log("Không tìm thấy user đăng nhập");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

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

  // Fetch search suggestions
  const fetchSearchSuggestions = (value) => {
    axios
      .get(`${URL}/searchAll/search?keyword=${value}`)
      .then((response) => {
        setSuggestions(response.data.data.courses);
      })
      .catch((error) => {
        console.error("Error fetching search suggestions:", error);
      });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      // Fetch search suggestions if input length > 2
      fetchSearchSuggestions(e.target.value);
    } else {
      setSuggestions([]); // Clear suggestions if input is less than 3 characters
    }
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
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // // Hàm để hiển thị các gợi ý (có thể là mặc định hoặc từ API)
  // const displaySuggestions = () => {
  //   if (searchQuery.length === 0) {
  //     // Nếu người dùng chưa nhập gì, hiển thị gợi ý mặc định
  //     return defaultSuggestions;
  //   }
  //   // Nếu người dùng đã nhập, hiển thị các gợi ý từ API
  //   return suggestions;
  // };

  const handleFocus = () => {
    // Khi người dùng focus vào ô input, hiển thị các gợi ý mặc định
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Khi người dùng blur khỏi ô input, ẩn các gợi ý
    setShowSuggestions(false);
  };

  return (
    <nav className="px-4 py-3 dark:bg-black">
      <div className="flex justify-between items-center">
        <img
          src="/logo.png"
          className="rounded-full object-cover"
          width={60}
          height={60}
        ></img>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center w-full ml-4">
          <div className="flex w-[50%] justify-center gap-2 items-center border p-2 rounded-xl relative">
            <FaSearch className="text-gray-500 cursor-pointer" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full text-sm focus:outline-none"
            />
            {(showSuggestions || searchQuery.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg py-2 z-10">
                <ul className="max-h-60 overflow-auto">
                  {suggestions.map((suggestion, id) => (
                    <li
                      key={suggestion.id}
                      className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                    >
                      <Link
                        to={`/view-course/${suggestion.id}`}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            suggestion.img
                              ? suggestion.img
                              : "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                          }
                          alt="Course"
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {suggestion.courseName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {suggestion.price} Coin
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div ref={dropdownRef} className="relative items-center">
          {localStorage.getItem("username") ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {localStorage.getItem("coin")}
                </span>
                <FaCoins style={{ color: "gold" }} size={30} />
              </div>
              <div ref={notificationRef} className="relative">
                <div
                  className="relative cursor-pointer"
                  onClick={toggleNotificationDropdown}
                >
                  <PiBellRinging
                    size={40}
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
                  src={
                    localStorage.getItem("img") !== "null"
                      ? localStorage.getItem("img")
                      : "/user.png"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-600 text-lg w-34 overflow:hidden">
                  {localStorage.getItem("username")}
                </span>
              </div>

              {/* Dark Mode Button with Icon */}
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </div>
          ) : (
            <button className="bg-fcolor hover:bg-scolor text-md text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
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
                  onClick={() => handleLogout()}
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
