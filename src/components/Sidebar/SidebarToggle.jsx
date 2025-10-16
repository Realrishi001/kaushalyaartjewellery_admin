"use client";

import React from "react";
import { Menu } from "lucide-react";

const SidebarToggle = ({ onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
        rounded-xl transition-all duration-200 ${className}
      `}
    >
      <Menu className="w-6 h-6" />
    </button>
  );
};

export default SidebarToggle;