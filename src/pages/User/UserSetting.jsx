import { useState } from "react";
import { FaMoon, FaGlobe, FaSignOutAlt } from "react-icons/fa";

const UserSetting = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleLogout = () => {
    // Xử lý logout tại đây
    console.log("Logged out");
  };

  return (
    <div className="flex-1 flex flex-col h-fit py-10 px-4">
      <div className="max-w-2xl w-full mx-auto space-y-6 bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaGlobe size={24} />
          Settings
        </h2>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaMoon size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Dark Mode</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-scolor"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
          </label>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGlobe size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-scolor"
          >
            <option>English</option>
            <option>Vietnamese</option>
          </select>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            <FaSignOutAlt size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSetting;
