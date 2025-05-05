import { useEffect, useState } from "react";
import { FaMoon, FaGlobe, FaSignOutAlt, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import URL from "../../config/URLconfig"; // Cập nhật nếu cần

const UserSetting = () => {
  const { i18n, t } = useTranslation("settings"); // Sử dụng đúng namespace
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  // Load theme + language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const savedLang = localStorage.getItem("language");

    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }

    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
  };

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

  return (
    <div className="flex-1 flex flex-col h-full items-center justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-6 bg-wcolor dark:bg-darkBackground dark:border dark:border-darkBorder dark:text-darkText rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaGlobe size={24} />
          {t("title")} {/* Đổi từ settings.title sang t("title") */}
        </h2>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <FaSun size={20} className="text-yellow-500" />
            ) : (
              <FaMoon size={20} className="text-gray-500" />
            )}
            <span className="font-medium">{t("darkMode")}</span> {/* Đổi từ settings.darkMode sang t("darkMode") */}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-wcolor dark:bg-gray-700"></div>
            <div className="absolute left-1 top-1 bg-wcolor w-4 h-4 rounded-full transition-all peer-checked:bg-black peer-checked:translate-x-5" />
          </label>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGlobe size={20} className="text-gray-500" />
            <span className="font-medium">{t("language")}</span> {/* Đổi từ settings.language sang t("language") */}
          </div>
          <select
            value={language} // Đảm bảo giá trị của select được đồng bộ với trạng thái language
            onChange={handleLanguageChange}
            className="border-1 dark:border-darkBorder bg-wcolor dark:border dark:bg-darkBackground text-gray-700 dark:text-darkText rounded-lg px-4 py-2 focus:outline-none"
          >
            <option value="en">{t("english")}</option> {/* Đổi từ English sang t("english") */}
            <option value="vi">{t("vietnamese")}</option> {/* Đổi từ Vietnamese sang t("vietnamese") */}
          </select>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            <FaSignOutAlt size={18} />
            {t("logout")} {/* Đổi từ settings.logout sang t("logout") */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSetting;
