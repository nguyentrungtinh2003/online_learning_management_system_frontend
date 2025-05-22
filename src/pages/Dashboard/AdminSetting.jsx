import { useEffect, useState } from "react";
import { FaCog, FaUserShield, FaCreditCard } from "react-icons/fa";
import URL from "../../config/URLconfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AdminSettings = () => {
  const { t } = useTranslation("adminsetting");
  const [activeTab, setActiveTab] = useState("general");
  const [img, setImg] = useState(null);
  const [formData, setFormData] = useState({
    systemName: "",
    slogan: "",
    address: "",
    phoneNumber: "",
    email: "",
    socialMediaURL: "",
    description: "",
    userId: 1,
    img: null,
  });

  useEffect(() => {
    getSystemInfo(1);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append(
      "system",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (img) data.append("img", img);

    try {
      await axios.post(`${URL}/admin/update/system-info/1`, data, {
        withCredentials: true,
      });
      alert(t("alert.updated"));
    } catch (err) {
      console.error("Error updated form:", err);
    }
  };

  const getSystemInfo = (id) => {
    axios
      .get(`${URL}/admin/system-info/${id}`, { withCredentials: true })
      .then((response) => {
        setFormData(response.data.data);
        setImg(response.data.data.img);
      });
  };

  return (
    <div className="w-full h-full">
      <div className="h-full bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
        <div className="flex mb-4 lg:flex-row flex-col flex-1 gap-4 lg:gap-0 items-center justify-between">
          <div className="flex mx-2 justify-start w-full items-center gap-2 dark:text-darkText">
            <FaCog size={30} />
            <h2 className="text-4xl lg:text-lg font-bold">{t("title")}</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-start w-full gap-2">
            {[
              { key: "general", icon: <FaCog />, label: t("tabs.general") },
              {
                key: "account",
                icon: <FaUserShield />,
                label: t("tabs.account"),
              },
              {
                key: "configuration",
                icon: <FaCreditCard />,
                label: t("tabs.configuration"),
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center text-2xl lg:text-base mb-2 gap-2 cursor-pointer text-gray-600 px-8 border-2 dark:border-darkBorder dark:bg-darkBackground py-3 lg:py-2 rounded-xl ${
                  activeTab === tab.key
                    ? "font-bold bg-ficolor dark:bg-wcolor dark:text-black text-wcolor"
                    : "hover:scale-105 hover:text-gray-900 dark:text-wcolor hover:bg-tcolor dark:hover:bg-darkHover"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="rounded py-2 bg-wcolor dark:text-darkText dark:border dark:border-darkBorder dark:bg-darkSubbackground px-6 space-y-4">
          {activeTab === "general" && (
            <div className="lg:px-6 space-y-4">
              {[
                ["systemName", "placeholders.systemName"],
                ["slogan", "placeholders.slogan"],
                ["address", "placeholders.address"],
                ["phoneNumber", "placeholders.phone"],
                ["email", "placeholders.email"],
                ["socialMediaURL", "placeholders.social"],
              ].map(([field, placeholderKey]) => (
                <div className="flex items-center space-x-4" key={field}>
                  <label className="w-1/4 text-2xl lg:text-base font-medium">
                    {t(`labels.${field}`)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border-2 text-2xl lg:text-base dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                    placeholder={t(placeholderKey)}
                  />
                </div>
              ))}

              <div className="flex items-center space-x-4">
                <label className="w-1/4 text-2xl lg:text-base font-medium">{t("labels.logo")}:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1 text-2xl lg:text-base dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
                />
                {img && <img src={img} className="w-20 h-20" />}
              </div>

              <div className="flex items-start space-x-4">
                <label className="w-1/4 text-2xl lg:text-base font-medium pt-2">
                  {t("labels.description")}:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex-1 text-2xl lg:text-base px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder={t("placeholders.description")}
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="text-white text-3xl lg:text-base px-6 py-3 lg:py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
                >
                  {t("buttons.save")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-4 text-2xl lg:text-base">
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("labels.avatar")}:
                </label>
                <input
                  type="file"
                  className="flex-1 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">{t("labels.name")}:</label>
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("labels.email")}:
                </label>
                <input
                  type="email"
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("labels.password")}:
                </label>
                <input
                  type="password"
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                />
              </div>
            </div>
          )}

          {activeTab === "configuration" && (
            <div className="space-y-4 text-2xl lg:text-base">
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("labels.darkMode")}:
                </label>
                <input type="checkbox" className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {t("labels.language")}:
                </label>
                <select className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg">
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
