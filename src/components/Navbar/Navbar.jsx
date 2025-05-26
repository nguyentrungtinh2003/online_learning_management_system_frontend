import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCoins, FaMoon, FaSun, FaStar } from "react-icons/fa";
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
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { TbCoin } from "react-icons/tb";

export default function Navbar() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [img, setImg] = useState(localStorage.getItem("img") || "/user.png");

  console.log("Username ", username);

  console.log("Img ", img);

  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const languageOptions = [
    {
      value: "en",
      label: (
        <div className="flex items-center gap-2">
          <img
            src={englishFlag}
            alt="English"
            className="lg:h-6 lg:w-6 h-10 w-10 object-cover"
          />
          <span className="lg:block hidden">EN</span>
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
            className="lg:h-6 lg:w-6 h-10 w-10 object-cover"
          />
          <span className="lg:block hidden">VI</span>
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

  const [point, setPoint] = useState(localStorage.getItem("point") || 0);
  const [coin, setCoin] = useState(localStorage.getItem("coin") || 0);

  const { t, i18n } = useTranslation("navbar");
  const [language, setLanguage] = useState(i18n.language || "en");

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    let savedTheme = localStorage.getItem("darkMode");
    const savedLang = localStorage.getItem("language");

    if (savedTheme === null) {
      // Mặc định dark mode nếu chưa có key
      savedTheme = "true";
      localStorage.setItem("darkMode", "true");
    }

    if (savedTheme === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
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
    fetchSystemInfo();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [unreadCount]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/user-info`, {
        withCredentials: true,
      });

      const { id, email, username, img, coin, roleEnum, point } =
        response.data.data;

      localStorage.setItem("id", id);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);
      localStorage.setItem("img", img);
      localStorage.setItem("coin", coin);
      localStorage.setItem("role", roleEnum);
      localStorage.setItem("point", point);

      setUsername(username);
      setImg(img);
      setCoin(coin);
      setPoint(point);
    } catch (err) {
      console.log("⚠️ Không tìm thấy thông tin user (Google hoặc JWT).");

      localStorage.clear();
      setUsername(null);
      setImg(null);
      setCoin(null);
      setPoint(null);
    }
  };

  const fetchSystemInfo = () => {
    axios
      .get(`${URL}/system-info/1`, { withCredentials: true })
      .then((response) => {
        localStorage.setItem("systemName", response.data.data.systemName);
        localStorage.setItem("description", response.data.data.description);
        localStorage.setItem("slogan", response.data.data.slogan);
        localStorage.setItem("systemImg", response.data.data.img);
        localStorage.setItem("address", response.data.data.address);
        localStorage.setItem("phoneNumber", response.data.data.phoneNumber);
        localStorage.setItem("systemEmail", response.data.data.email);
        localStorage.setItem(
          "socialMediaURL",
          response.data.data.socialMediaURL
        );
      });
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
        const userId = parseInt(localStorage.getItem("id"));
        stompClient.subscribe(`/topic/user/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          setNotifications((prev) => [...prev, notification]);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${URLSocket}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const userId = parseInt(localStorage.getItem("id"));
        stompClient.subscribe(`/topic/user-info/${userId}`, (message) => {
          const userInfo = JSON.parse(message.body);
          console.log("User websocket: ", userInfo);
          setCoin(userInfo.coin);
          setPoint(userInfo.point);
        });
      },
    });

    stompClient.activate();

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
      localStorage.clear();
      setUsername(null);
      setImg(null);
      setCoin(null);
      setPoint(null);
      console.log("Logout success:");
      navigate("/"); // Điều hướng đến trang đăng nhập
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
    setTimeout(() => {
      setSearchQuery(""); // Reset input
      setSuggestions([]); // Ẩn suggestions
    }, 1000);
  };

  return (
    <nav className="px-4 bg-wcolor py-3 dark:bg-darkBackground dark:text-darkText">
      <div className="flex justify-between items-center">
        <Link to={"/"}>
          <img
            src={
              localStorage.getItem("systemImg") !== "null"
                ? localStorage.getItem("systemImg")
                : "/logo.png"
            }
            className="rounded-full lg:w-12 lg:h-12 cursor-pointer object-cover h-20 w-20 mx-2"
            alt="logo"
          />
        </Link>
        <div className="lg:flex-1 w-fit flex lg:justify-end w-fit lg:ml-4">
          <div className="flex lg:h-10 h-14 lg:w-full justify-center gap-2 items-center border-1 dark:bg-darkBackground dark:border-darkBorder p-2 rounded-xl relative">
            <FaSearch className="text-gray-500 dark:text-darkSubtext cursor-pointer" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="lg:w-full w-32 lg:placeholder:text-gray-400 placeholder:text-transparent  text-sm bg-transparent dark:text-darkSubtext focus:outline-none"
            />
            {searchQuery.length > 0 && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 rounded-xl shadow-lg py-2 z-10">
                <ul className="max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="hover:bg-tcolor dark:hover:bg-darkHover px-4 py-2 cursor-pointer"
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
                          <span className="font-medium text-lightText dark:text-darkText">
                            {suggestion.courseName}
                          </span>
                          <span className="text-sm text-lightSubtext dark:text-darkSubtext">
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

        <div
          ref={dropdownRef}
          className="relative lg:w-[60%] flex justify-end items-center"
        >
          {/* {localStorage.getItem("username") ? ( */}{" "}
          {localStorage.getItem("username") ? (
            <div className="flex w-full items-center justify-between ml-2 space-x-4">
              <div className="flex flex-1 items-center justify-end lg:gap-4 gap-2">
                <div className="flex items-center justify-end gap-2">
                  <span className="lg:text-lg text-2xl">{point}</span>
                  <FaStar
                    style={{ color: "gold" }}
                    size={isLargeScreen ? 20 : 25}
                  />
                </div>
                <div className="flex items-center gap-2 justify-end gap-2">
                  <span className="lg:text-lg text-2xl">{coin}</span>
                  <TbCoin
                    style={{ color: "gold" }}
                    size={isLargeScreen ? 25 : 30}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div ref={notificationRef} className="relative">
                  <div
                    className="relative mx-2 cursor-pointer"
                    onClick={toggleNotificationDropdown}
                  >
                    <PiBellRinging
                      size={isLargeScreen ? 30 : 40}
                      className="hover:bg-tcolor dark:hover:bg-darkBorder lg:p-1 p-0 rounded-xl"
                    />
                    {unreadCount >= 0 && (
                      <span className="absolute lg:left-5 top-4 left-6 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
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
                      img !== "null"
                        ? img
                        : localStorage.getItem("img") || "/user.png"
                    }
                    alt="User"
                    className="lg:w-10 lg:h-10 w-12 h-12 rounded-full object-cover"
                  />
                  <span className="lg:text-lg text-xl whitespace-nowrap w-[160px] overflow-hidden text-ellipsis">
                    {username}
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
              </div>
              <button
                onClick={toggleDarkMode}
                className="text-fcolor w-fit dark:text-fcolor p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isDarkMode ? (
                  <FaSun size={isLargeScreen ? 20 : 35} />
                ) : (
                  <FaMoon size={isLargeScreen ? 20 : 35} />
                )}
              </button>
              {/* Language Dropdown */}
              <Dropdown
                options={languageOptions}
                selected={language}
                onChange={(lang) => {
                  i18n.changeLanguage(lang);
                  localStorage.setItem("language", lang);
                }}
                placeholder="Select Language"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="text-fcolor w-fit dark:text-fcolor p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isDarkMode ? (
                  <FaSun size={isLargeScreen ? 20 : 35} />
                ) : (
                  <FaMoon size={isLargeScreen ? 20 : 35} />
                )}
              </button>
              {/* Language Dropdown */}
              <Dropdown
                options={languageOptions}
                selected={language}
                onChange={(lang) => {
                  i18n.changeLanguage(lang);
                  localStorage.setItem("language", lang);
                }}
                placeholder="Select Language"
              />
              <button className="bg-fcolor hover:scale-105 text-md text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
                <Link to="/login" className="no-underline text-white">
                  {t("startLearning")}
                </Link>
              </button>
            </div>
          )}
          {isNotificationOpen && (
            <div className="absolute right-10 top-10 w-[600px] p-2 mt-2 bg-wcolor dark:bg-darkBackground border-1 dark:border-darkBorder rounded-xl shadow-lg z-20">
              <h3 className="text-lg w-full dark:text-darkText text-center font-semibold border-b dark:border-darkBorder pb-2">
                {t("notifications")}
              </h3>
              <ul className="py-2 h-[40%] overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center">
                      <li
                        className={`hover:bg-tcolor dark:hover:bg-darkHover px-4 py-2 text-gray-500 dark:text-darkText break-words ${
                          !notification.read
                            ? "font-black dark:text-darkText"
                            : "text-gray-700 dark:text-darkSubtext"
                        }`}
                      >
                        {notification.message}
                      </li>

                      <button
                        onClick={() =>
                          readNotifications(parseInt(notification.id))
                        }
                        className="btn btn-primary text-sm"
                      >
                        Read
                      </button>
                    </div>
                  ))
                ) : (
                  <li className="hover:bg-tcolor dark:hover:bg-darkHover px-4 py-2 text-gray-500 dark:text-darkText break-words">
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
