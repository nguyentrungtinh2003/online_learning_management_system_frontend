import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCoins, FaMoon, FaSun } from "react-icons/fa";
import { PiBellRinging } from "react-icons/pi";
import URL from "../../config/URLconfig";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import Dropdown from "../Button/Dropdown";
import vietnamFlag from "../../assets/vietnamflag.webp";
import englishFlag from "../../assets/english.png";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import URLSocket from "../../config/URLsocket";

export default function Navbar() {
  const languageOptions = [
    {
      value: "en",
      label: (
        <div className="flex items-center gap-2">
          <img
            src={englishFlag}
            alt="English"
            className="h-6 w-6 object-cover"
          />
          <span>EN</span>
        </div>
      ),
    },
    {
      value: "vi",
      label: (
        <div className="flex items-center gap-2">
          <img
            src={vietnamFlag}
            alt="Vietnamese"
            className="h-6 w-6 object-cover"
          />
          <span>VI</span>
        </div>
      ),
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const { t, i18n } = useTranslation("navbar");
  const [language, setLanguage] = useState(i18n.language || "en");

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const savedLang = localStorage.getItem("language");

    if (savedTheme === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }

    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(i18n.language);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    setLanguage(selectedLang);
    window.location.reload(); // Thêm dòng này để reload trang
  };

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

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [unreadCount]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/user-info`);
      const { id, email, username, img, coin, roleEnum } = response.data.data;
      localStorage.setItem("id", id);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);
      localStorage.setItem("img", img);
      localStorage.setItem("coin", coin);
      localStorage.setItem("role", roleEnum);
    } catch {
      try {
        const googleResponse = await axios.get(`${URL}/user-google`);
        const { id, email, name, picture } = googleResponse.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);

        axios.get(`${URL}/user/email/${email}`).then((response) => {
          localStorage.setItem("coin", response.data.data.coin);
          localStorage.setItem("role", response.data.data.roleEnum);
        });
      } catch {
        console.log("Không tìm thấy user đăng nhập");
      }
    }
  };

  const fetchNotifications = () => {
    axios
      .get(`${URL}/notifications/${parseInt(localStorage.getItem("id"))}`, {
        withCredentials: true,
      })
      .then((response) => {
        setNotifications(response.data.data);
        const unread = response.data.data.length;
        setUnreadCount(unread);
        console.log("Notilength " + unread);
      })
      .catch((error) => console.error("Failed to fetch notifications:", error));
  };

  const readNotifications = (notificationId) => {
    console.log("Noti id " + notificationId);
    axios
      .put(`${URL}/notifications/read/${notificationId}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Read notification success !");
        window.location.reload();
        fetchNotifications();
      })
      .catch((error) => console.error("Failed to fetch notifications:", error));
  };

  useEffect(() => {
    const socket = new SockJS(`${URLSocket}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(
          `/topic/user/${parseInt(localStorage.getItem("id"))}`,
          (message) => {
            const notification = JSON.parse(message.body);
            setNotifications((prev) => [...prev, notification]);
          }
        );
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      fetchSearchSuggestions(e.target.value);
    } else {
      setSuggestions([]);
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
    setLoadingLogout(true);
    try {
      await axios.get(`${URL}/logout/google`, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/";
      setLoadingLogout(false);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <nav className="px-4 py-3 dark:bg-darkBackground dark:text-darkText">
      <div className="flex justify-between items-center">
        <img
          src="/logo.png"
          className="rounded-full cursor-pointer object-cover h-10 mx-2"
          alt="logo"
        />
        <div className="flex-1 flex justify-end pr-32 w-full ml-4">
          <div className="flex w-[50%] justify-center gap-2 items-center border-1 dark:border-darkBorder p-2 rounded-xl relative">
            <FaSearch className="text-gray-500 dark:text-darkSubtext cursor-pointer" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full text-sm dark:bg-darkBackground dark:text-darkSubtext focus:outline-none"
            />
            {(showSuggestions || searchQuery.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg py-2 z-10">
                <ul className="max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
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
                <span>{localStorage.getItem("coin")}</span>
                <FaCoins style={{ color: "gold" }} size={30} />
              </div>
              <div ref={notificationRef} className="relative">
                <div
                  className="relative cursor-pointer"
                  onClick={toggleNotificationDropdown}
                >
                  <PiBellRinging
                    size={40}
                    className="hover:bg-focolor dark:hover:bg-darkBorder p-1 rounded-xl"
                  />
                  {unreadCount >= 0 && (
                    <span className="absolute top-4 left-6 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="flex relative items-center space-x-2 cursor-pointer"
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
                <span className="text-lg w-34 overflow-hidden">
                  {localStorage.getItem("username")}
                </span>
                {isDropdownOpen && (
                  <div className="absolute top-10 mt-2 text-gray-700 bg-wcolor dark:bg-darkBackground dark:text-darkText border-1 dark:border-darkBorder rounded-lg shadow-lg z-20">
                    <ul className="py-2 font-semibold whitespace-nowrap">
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                        <Link to="/profile">{t("profileInfo")}</Link>
                      </li>
                      <hr className="border-t border-gray-400 dark:border-darkBorder mx-3 my-1" />
                      <li
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={handleLogout}
                      >
                        {loadingLogout ? (
                          <Spinner animation="border" variant="blue" />
                        ) : (
                          t("logout")
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>

              {/* Language Dropdown */}
              <Dropdown
                options={languageOptions}
                selected={language}
                onChange={(lang) => {
                  i18n.changeLanguage(lang);
                  localStorage.setItem("language", lang);
                  window.location.reload();
                }}
                placeholder="Select Language"
              />
            </div>
          ) : (
            <button className="bg-fcolor hover:bg-scolor text-md text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
              <Link to="/login" className="no-underline text-white">
                {t("startLearning")}
              </Link>
            </button>
          )}

          {isNotificationOpen && (
            <div className="absolute right-10 top-10 w-[600px] p-2 mt-2 bg-wcolor dark:bg-darkBackground border-1 dark:border-darkBorder rounded-xl shadow-lg z-20">
              <h3 className="text-lg w-full text-center font-semibold border-b dark:border-darkBorder pb-2">
                {t("notifications")}
              </h3>
              <ul className="py-2 h-[40%] overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id}>
                      <li
                        className={`hover:bg-gray-100 dark:hover:bg-darkBorder px-4 py-2 cursor-pointer break-words ${
                          !notification.read
                            ? "font-bold text-black dark:text-darkText"
                            : "text-gray-700 dark:text-darkSubtext"
                        }`}
                      >
                        {notification.message}
                      </li>
                      <button
                        onClick={() =>
                          readNotifications(parseInt(notification.id))
                        }
                        className="btn btn-primary"
                      >
                        Read
                      </button>
                    </div>
                  ))
                ) : (
                  <li className="hover:bg-gray-100 dark:hover:bg-darkBorder px-4 py-2 text-gray-500 dark:text-darkText break-words">
                    {t("noNotifications")}
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
