import { useEffect, useState } from "react";
import { FaCog, FaUserShield, FaBell, FaCreditCard } from "react-icons/fa";
import URL from "../../config/URLconfig";
import axios from "axios";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    getSystemInfo(1);
  }, []);

  const [formData, setFormData] = useState({
    systemName: "",
    slogan: "",
    address: "",
    phoneNumber: "",
    email: "",
    socialMediaURL: "",
    description: "",
    userId: 1, // ID của user đang đăng nhập
    img: null,
  });

  const [img, setImg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Thêm các trường text
    data.append(
      "system",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    // Thêm ảnh (nếu có)
    if (img) {
      data.append("img", img);
    }

    try {
      await axios.post(`${URL}/admin/system-info/add`, data, {
        withCredentials: true,
      });
      alert("System Info saved successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Thêm các trường text
    data.append(
      "system",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    // Thêm ảnh (nếu có)
    if (img) {
      data.append("img", img);
    }

    try {
      await axios.post(`${URL}/admin/update/system-info/1`, data, {
        withCredentials: true,
      });
      alert("System Info updated successfully!");
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
      <div className="flex-1 flex flex-col h-fit">
        <div className="flex gap-2 items-center dark:text-darkText mb-2">
          <FaCog size={30} />
          <h2 className="text-lg font-bold">Admin Settings</h2>
        </div>

        {/* Tabs */}
        <div className="flex w-full justify-center dark:border-darkBorder gap-4 border-b pb-2">
          {[
            { key: "general", icon: <FaCog />, label: "General" },
            {
              key: "account",
              icon: <FaUserShield />,
              label: "Account Settings",
            },
            {
              key: "configuration",
              icon: <FaCreditCard />,
              label: "Configuration",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === tab.key
                  ? "font-bold bg-scolor text-white"
                  : "hover:bg-gray-100 dark:border dark:border-darkBorder dark:text-darkText dark:hover:bg-darkSubbackground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-2 bg-wcolor dark:text-darkText dark:border dark:border-darkBorder dark:bg-darkSubbackground p-6 rounded-lg shadow-xl space-y-4">
          {activeTab === "general" && (
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Website Name:</label>
                <input
                  type="text"
                  name="systemName"
                  value={formData.systemName}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  placeholder="Code Arena"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Slogan:</label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="Học lập trình, chinh phục Code Arena!"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Logo:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
                />
                <img src={img} className="w-20 h-20"></img>
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="123 Đường Lập Trình, TP.HCM"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="0123 456 789"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="admin@codearena.com"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">Social Media URL:</label>
                <input
                  type="text"
                  name="socialMediaURL"
                  value={formData.socialMediaURL}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="https://facebook.com/codearena"
                />
              </div>

              <div className="flex items-start space-x-4">
                <label className="w-1/4 font-medium pt-2">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg"
                  placeholder="Giới thiệu về Code Arena..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={(e) => handleUpdate(e)}
                  className="text-white px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Avatar:</label>
                  <input
                    type="file"
                    className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Name:</label>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Email:</label>
                  <input
                    type="email"
                    className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Password:</label>
                  <input
                    type="password"
                    className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "configuration" && (
            <div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Dark Mode:</label>
                  <input type="checkbox" className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium">Language:</label>
                  <select className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor">
                    <option>English</option>
                    <option>Vietnamese</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
