import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">FIFO Inventory Dashboard</h1>
      <button
        className="bg-white text-indigo-600 px-3 py-1 rounded-lg hover:bg-gray-100"
        onClick={onLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
