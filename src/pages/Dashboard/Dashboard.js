import { FaUsers, FaDollarSign, FaBookOpen, FaChartLine } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import Chart from "./Chart";

const Dashboard = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Analytics",
        data: [5000, 10000, 7500, 12000, 9000, 15000, 13000],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="flex-1 h-fit">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full p-6">
        <AdminNavbar />

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white px-4 w-full rounded-xl shadow-md text-center">
            <div className="flex-1 py-4 w-full flex justify-between">
              <div>
                <p className="font-bold text-2xl">Total Revenue</p>
                <p className="text-left text-lg">Last 30 days</p>
              </div>
              <FaDollarSign size={30} className="text-green-500" />
            </div>
            <h3 className="text-2xl text-left text-fcolor font-bold">
              $80,620
            </h3>
          </div>
          <div className="bg-white px-4 w-full rounded-xl shadow-md text-center">
            <div className="flex-1 py-4 w-full flex justify-between">
              <div>
                <p className="font-bold text-2xl">Total Users</p>
                <p className="text-left text-lg">Last 30 days</p>
              </div>
              <FaUsers size={30} className="text-blue-500" />
            </div>
            <h3 className="text-2xl text-left text-fcolor font-bold">1632</h3>
          </div>
          <div className="bg-white px-4 w-full rounded-xl shadow-md text-center">
            <div className="flex-1 py-4 w-full flex justify-between">
              <div>
                <p className="font-bold text-2xl">Total Courses</p>
                <p className="text-left text-lg">Last 30 days</p>
              </div>
              <FaBookOpen size={30} className="text-purple-500" />
            </div>
            <h3 className="text-2xl text-left text-fcolor font-bold">65</h3>
          </div>
          <div className="bg-white px-4 w-full rounded-xl shadow-md text-center">
            <div className="flex-1 py-4 w-full flex justify-between">
              <div>
                <p className="font-bold text-2xl">New Access</p>
                <p className="text-left text-lg">Last 30 days</p>
              </div>
              <FaChartLine size={30} className="text-orange-500" />
            </div>
            <h3 className="text-2xl text-left text-fcolor font-bold">120</h3>
          </div>
        </div>

        {/* Sales Analytics Chart */}
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;
