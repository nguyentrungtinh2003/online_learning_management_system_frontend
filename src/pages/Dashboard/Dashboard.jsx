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

  useEffect(() => {
    fetchTotalUser();
    fetchTotalCourse();
    fetchTotalAmount();
    fetchLog();
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTotalUser = () => {
    axios
      .get(`${URL}/user/count`)
      .then((response) => {
        setCountUser(response.data.data);
      })
      .catch((error) => {
        console.log("Error get count user " + error.message);
      });
  };

  const fetchTotalCourse = () => {
    axios
      .get(`${URL}/courses/count`)
      .then((response) => {
        setCountCourse(response.data.data);
      })
      .catch((error) => {
        console.log("Error get count course " + error.message);
      });
  };

  const fetchTotalAmount = () => {
    axios
      .get(`${URL}/payments/total`)
      .then((response) => {
        setAmount(response.data.data);
      })
      .catch((error) => {
        console.log("Error get amount " + error.message);
      });
  };

  const fetchLog = () => {
    axios
      .get(`${URL}/admin/logs/all`, { withCredentials: true })
      .then((response) => {
        const now = new Date();
        const past30Days = new Date();
        past30Days.setDate(now.getDate() - 30);

        const logs = response.data.data;

        // Lọc log trong 30 ngày gần nhất
        const recentLogs = logs.filter((log) => {
          const logDate = new Date(...log.timestamp); // timestamp là mảng như [2024, 6, 30, 12, 34, 56]
          return logDate >= past30Days;
        });

        // Tổng số lượt truy cập mới (đếm số lượng log hợp lệ)
        const accessCount = recentLogs.length;

        // Gán giá trị cho state
        setLogData(accessCount); // bạn cần tạo state accessCount
      })
      .catch((error) =>
        console.log("Error fetching access logs: " + error.message)
      );
  };

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

  return (
    <div className="flex-1 h-full">
      {/* Main Content */}
      <div className="flex flex-col gap-2">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-2">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-wcolor flex justify-between items-center px-16 lg:p-4 lg:h-fit h-[15vh] dark:bg-darkSubbackground dark:border dark:border-darkBorder dark:text-darkText space-y-2 w-full rounded-xl shadow-md"
            >
              <div className="flex flex-col items-left justify-between">
                <div className="">
                  <p className="font-bold text-7xl lg:text-xl">{item.title}</p>
                  <p className="text-left text-4xl lg:text-xs">
                    {t("last_30_days")}
                  </p>
                </div>
                <h3 className="text-7xl lg:text-4xl text-left text-fcolor font-bold">
                  {item.value}
                </h3>
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
          <StatisticalTable/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
