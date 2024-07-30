import React, { useState } from "react";
import { FaHome, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const [activeLink, setActiveLink] = useState("home");

  const handleSetActive = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="h-screen bg-gray-800 p-4 flex flex-col items-center">
      <ul className="flex flex-col space-y-4">
        <li>
          <Link
            to="/admin-dashboard"
            onClick={() => handleSetActive("home")}
            className={`p-2 text-white text-4xl ${
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
            className={`p-2 text-white text-4xl ${
              activeLink === "registration" ? "text-white rounded-lg" : ""
            }`}
          >
            <FaUserPlus />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
