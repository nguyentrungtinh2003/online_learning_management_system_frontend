import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewCards from "./OverviewCards";
import Charts from "./Charts";
import DetailsTable from "./DetailsTable";

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 mt-20">
        <Header />
        <div className="p-4">
          <OverviewCards />
          <Charts />
          <DetailsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
