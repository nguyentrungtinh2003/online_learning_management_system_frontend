import { FaUsers, FaDollarSign, FaBookOpen, FaChartLine } from "react-icons/fa";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="flex-1 h-fit">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <AdminNavbar />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Revenue",
              value: "$80,620",
              icon: <FaDollarSign className="text-green-500" />,
            },
            {
              title: "Total Users",
              value: "1632",
              icon: <FaUsers className="text-blue-500" />,
            },
            {
              title: "Total Courses",
              value: "65",
              icon: <FaBookOpen className="text-purple-500" />,
            },
            {
              title: "New Access",
              value: "120",
              icon: <FaChartLine className="text-orange-500" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white space-y-2 px-4 pt-4 pb-2 sm: w-full rounded-xl shadow-md text-center"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gcolor text-lg sm:text-xl">{item.title}</p>
                  <p className="text-left text-sm sm:text-xs">Last 30 days</p>
                </div>
                <div className="text-2xl sm:text-2xl">{item.icon}</div>
              </div>
              <h3 className="text-xl sm:text-xl text-left text-fcolor font-bold">
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Sales Analytics Chart */}
        <div className="flex-1 gap-4">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
