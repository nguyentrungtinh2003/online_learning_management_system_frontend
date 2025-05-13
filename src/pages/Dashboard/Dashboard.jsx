import { FaUsers, FaDollarSign, FaBookOpen, FaChartLine } from "react-icons/fa";
import Chart from "./Chart";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");

  const stats = [
    {
      title: t("total_revenue"),
      value: "$80,620",
      icon: <FaDollarSign className="text-green-500" />,
    },
    {
      title: t("total_users"),
      value: "1632",
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      title: t("total_courses"),
      value: "65",
      icon: <FaBookOpen className="text-purple-500" />,
    },
    {
      title: t("new_access"),
      value: "120",
      icon: <FaChartLine className="text-orange-500" />,
    },
  ];

  return (
    <div className="flex-1 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder dark:text-darkText space-y-2 px-4 pt-4 pb-2 w-full rounded-xl shadow-md text-center"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg sm:text-xl">{item.title}</p>
                  <p className="text-left text-sm sm:text-xs">{t("last_30_days")}</p>
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
        <div className="w-full gap-4">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
