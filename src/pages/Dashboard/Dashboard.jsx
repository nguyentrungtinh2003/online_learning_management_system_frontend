import { FaUsers, FaDollarSign, FaBookOpen, FaChartLine } from "react-icons/fa";
import Chart from "./Chart";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import { useEffect, useState } from "react";
import axios from "axios";
import StatisticalTable from "./StatisticalTable";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const [countUser, setCountUser] = useState(0);
  const [countCourse, setCountCourse] = useState(0);
  const [amount, setAmount] = useState(0);
  const [logData, setLogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [userRes, courseRes, amountRes, logRes] = await Promise.all([
          axios.get(`${URL}/user/count`),
          axios.get(`${URL}/courses/count`),
          axios.get(`${URL}/payments/total`),
          axios.get(`${URL}/admin/logs/all`, { withCredentials: true }),
        ]);

        setCountUser(userRes.data.data);
        setCountCourse(courseRes.data.data);
        setAmount(amountRes.data.data);

        // Xử lý log trong 30 ngày
        const now = new Date();
        const past30Days = new Date();
        past30Days.setDate(now.getDate() - 30);

        const logs = logRes.data.data;
        const recentLogs = logs.filter((log) => {
          const logDate = new Date(...log.timestamp);
          return logDate >= past30Days;
        });

        setLogData(recentLogs.length);
      } catch (error) {
        console.log("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const stats = [
    {
      title: t("total_revenue"),
      value: amount,
      icon: (
        <FaDollarSign size={isMobile ? 150 : 60} className="text-green-500" />
      ),
    },
    {
      title: t("total_users"),
      value: countUser,
      icon: <FaUsers size={isMobile ? 150 : 60} className="text-blue-500" />,
    },
    {
      title: t("total_courses"),
      value: countCourse,
      icon: (
        <FaBookOpen size={isMobile ? 150 : 60} className="text-purple-500" />
      ),
    },
    {
      title: t("new_access"),
      value: logData,
      icon: (
        <FaChartLine size={isMobile ? 150 : 60} className="text-orange-500" />
      ),
    },
  ];
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full">
      {/* Main Content */}
      <div className="flex flex-col gap-2">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-2">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-wcolor flex justify-between items-center px-16 lg:p-4 lg:h-fit h-[15vh] dark:bg-darkSubbackground dark:border dark:border-darkBorder dark:text-darkText space-y-2 w-full rounded-xl shadow-md"
            >
              <div className="flex flex-col items-left justify-between">
                <div className="">
                  <p className="font-bold text-3xl lg:text-xl">{item.title}</p>
                  <h3 className="text-6xl py-2 lg:text-4xl text-left text-fcolor font-bold">
                    {item.value}
                  </h3>
                </div>
                <p className="text-left text-xl lg:text-xs">
                  {t("last_30_days")}
                </p>
              </div>
              <div className="h-full flex justify-between items-center">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Sales Analytics Chart */}
        <div className="w-full flex flex-col gap-2">
          <Chart />
          <StatisticalTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
