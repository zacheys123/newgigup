"use client";
import useStore from "@/app/zustand/useStore";
import { UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaComments,
  FaBriefcase,
  FaVideo,
  FaStar,
  FaListAlt,
} from "react-icons/fa";

const ChatNavigation = () => {
  const { isOpen, setIsOpen } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight / 1.4,
  }); // Initial position

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  // React event handler for mouse down
  const handleMouseDown = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    setIsDragging(true);
  };

  // Native DOM event handler for mouse move
  const handleWindowMouseMove = (ev: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: ev.clientX,
        y: ev.clientY,
      });
    }
  };

  // Native DOM event handler for mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {/* Toggler Button */}
      <button
        className="fixed z-50 p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)", // Center the button on the cursor
        }}
        onMouseDown={handleMouseDown}
        onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
          ev.stopPropagation();
          toggleNavigation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white transform transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Side Navigation */}
      <div
        className={`fixed top-0 right-0 h-screen w-[61px] title  z-50 text-white transform transition-transform duration-500 ease-in-out  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <div className="p-6 h-[100%] flex justify-center items-center">
          <div className="h-fit p-2 bg-gradient-to-b from-gray-400 to-gray-100 shadow-2xl">
            <ul className="space-y-4 animate-in">
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaHome className="h-4 w-5 text-red-400" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaUser className="h-4 w-4 text-yellow-400" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaComments className="h-4 w-4 text-amber-500" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaBriefcase className="h-4 w-4 text-purple-400" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaVideo className="h-4 w-4 text-green-2300" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaStar className="h-4 w-4 text-fuchsia-400" />
              </li>
              <li className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#e9edf0] via-[#154958] to-[#0c6dc9]">
                <FaListAlt className="h-4 w-4 text-fuchsia-300" />
              </li>
              <UserButton />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatNavigation;
