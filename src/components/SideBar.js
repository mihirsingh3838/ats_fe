// src/components/Sidebar.jsx
import React, { useState } from "react";
import { FaHome, FaCameraRetro } from "react-icons/fa";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import Camera from "./Camera";

Modal.setAppElement('#root');

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSetActive = (link) => {
    setActiveLink(link);
    if (link === "attendance") {
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setActiveLink("home");
  };

  return (
    <div className="flex">
      <div className="bg-white md:w-[90px] w-full p-3 mb-2 md:flex md:items-center">
        <div className="rounded-xl p-4 bg-indigo-950">
          <ul className="flex flex-wrap">
            <li className="mx-2 md:mx-0 mb-4">
              <Link
                to="/"
                onClick={() => handleSetActive("home")}
                className={`rounded-lg p-2 text-gray-400 text-4xl bg-transparent ${
                  activeLink === "home" ? "bg-gray-800 text-white" : ""
                }`}
              >
                <FaHome />
              </Link>
            </li>
            <li className="mx-2 md:mx-0 mb-4">
              <button
                onClick={() => handleSetActive("attendance")}
                className={`rounded-lg p-2 text-gray-400 text-4xl bg-transparent ${
                  activeLink === "attendance" ? "bg-gray-800 text-white" : ""
                }`}
              >
                <FaCameraRetro />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Camera Modal"
        className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6 mx-auto my-20 w-full max-w-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
      >
        <Camera />
      </Modal>
    </div>
  );
};

export default Sidebar;
