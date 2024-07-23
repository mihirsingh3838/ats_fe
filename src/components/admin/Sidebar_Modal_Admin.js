import React from "react";

const ModalData = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl mb-4">Data</h2>
        {/* Add your data content here */}
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalData;