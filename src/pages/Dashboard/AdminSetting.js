import { useState } from "react";
import { FaCog, FaUserShield, FaBell, FaCreditCard } from "react-icons/fa";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex-1 h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full p-6">
        <AdminNavbar />
        <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>

        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2">
          <button
            onClick={() => setActiveTab("general")}
            className={activeTab === "general" ? "font-bold" : ""}
          >
            <FaCog /> General
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? "font-bold" : ""}
          >
            <FaUserShield /> Users
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={activeTab === "notifications" ? "font-bold" : ""}
          >
            <FaBell /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={activeTab === "payments" ? "font-bold" : ""}
          >
            <FaCreditCard /> Payments
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === "general" && (
            <div>
              <h3 className="text-lg font-bold">General Settings</h3>
              <label>Website Name:</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Code Arena"
              />
              <label>Logo:</label>
              <input type="file" className="border p-2 rounded w-full" />
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h3 className="text-lg font-bold">User Management</h3>
              <p>Manage admin, instructors, and students.</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-lg font-bold">Notification Settings</h3>
              <p>Configure email and system notifications.</p>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h3 className="text-lg font-bold">Payment & Subscription</h3>
              <p>Manage payment methods and subscription plans.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
