import React from "react";
import AdminSidebar from "../components/admin/Sidebar_Admin";

import AdminLineChart from "../components/admin/Chart_Admin";
import AdminCards from "../components/admin/Cards_Admin";
import WorldMapAdmin from "../components/admin/WorldMap_Admin";

const AdminDashboard = () => {
  return (
    <div className="md:flex">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <div className="mb-5 w-full">
        </div>
        <div className="mb-5 w-full">
          <AdminCards />
        </div>
        <div className="flex md:mx-5 space-x-5">
          <div className="md:w-1/3 lg:w-2/3 w-full mb-2">
            <AdminLineChart />
          </div>
          <div className="md:w-1/2 lg:w-1.2/3 w-full mb-2">
            <WorldMapAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;