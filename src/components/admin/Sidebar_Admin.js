import React, { useState } from "react";
import { FaHome, FaUserPlus, FaDatabase } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalData from "./Sidebar_Modal_Admin";

const AdminSidebar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const handleSetActive = (link) => {
    setActiveLink(link);
  };

  const handleOpenDataModal = () => {
    setIsDataModalOpen(true);
  };

  const handleCloseDataModal = () => {
    setIsDataModalOpen(false);
  };

  return (
    <div className="h-screen bg-indigo-300 p-4 flex flex-col items-center">
      <ul className="flex flex-col space-y-4">
        <li>
          <Link
            to="/admin-dashboard"
            onClick={() => handleSetActive("home")}
            className={`p-2 text-black text-4xl ${
              activeLink === "home" ? "text-white rounded-lg" : ""
            }`}
          >
            <FaHome />
          </Link>
        </li>
        <li>
          <Link
            to="/signup"
            onClick={() => handleSetActive("signup")}
            className={`p-2 text-black text-4xl ${
              activeLink === "registration" ? "text-white rounded-lg" : ""
            }`}
          >
            <FaUserPlus />
          </Link>
        </li>
      </ul>
      <ModalData isOpen={isDataModalOpen} onClose={handleCloseDataModal} />
    </div>
  );
};

export default AdminSidebar;
