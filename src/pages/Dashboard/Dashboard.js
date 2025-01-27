import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewCards from "./OverViewPage/OverviewCards";
import Charts from "./OverViewPage/Charts";
import DetailsTable from "./OverViewPage/DetailsTable";
import SendEmail from "./AdminPages/SendEmail";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex items-center w-full justify-center">
        <div className="p-4">
          <OverviewCards />
          <Charts />
          <DetailsTable />
          <SendEmail />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
