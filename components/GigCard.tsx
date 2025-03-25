import React, { ReactNode } from "react";
import { Button } from "./ui/button";

interface GigCardsProps {
  userload: boolean;
  role: string;
  title: string;
  color: string;
  description: string;
  onClick?: () => void;
  buttonText: string | ReactNode; // Accepts both string and JSX
  disabled: boolean;
}

const GigCard = ({
  role,
  title,
  color,
  description,
  buttonText,
  disabled,
  onClick,
  userload,
}: GigCardsProps) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`bg-gray-800 p-2 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm my-2 mx-2 ${
        disabled ? "opacity-70" : ""
      } ${role === "both" ? "bg-red-800" : ""}`}
    >
      <h2
        className={`text-xl sm:text-2xl font-semibold ${
          color === "orange"
            ? "text-orange-500"
            : color === "blue"
            ? "text-blue-300"
            : "text-gray-100"
        } mb-4`}
      >
        {title}
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">{description}</p>
      {userload && (
        <Button
          className={`${
            color === "orange"
              ? "!bg-orange-700"
              : color === "blue"
              ? "!bg-blue-800"
              : "!bg-emerald-800"
          } !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base`}
          disabled={disabled}
        >
          {buttonText} {/* This now accepts ReactNode */}
        </Button>
      )}
    </div>
  );
};

export default GigCard;
