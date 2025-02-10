import React from "react";
import { Button } from "../ui/button";
import { Box, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import { BsCameraFill } from "react-icons/bs";
import { colors, fonts } from "@/utils";
import "../loaders/word.css";
interface CustomizationProps {
  fontColor: string;
  font: string;
  backgroundColor: string;
}

interface GigCustomizationProps {
  customization: CustomizationProps;
  setCustomization: React.Dispatch<React.SetStateAction<CustomizationProps>>;
  closeModal: () => void;
  logo: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const GigCustomization: React.FC<GigCustomizationProps> = ({
  customization,
  setCustomization,
  closeModal,
  logo,
  handleFileChange,
  isUploading,
}) => {
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black  h-[900px] bg-opacity-70 backdrop-blur-md animate-fadeIn mt-[25px] w-[90%] mx-auto">
      <div className="bg-white/20 backdrop-blur-0 p-6 rounded-2xl shadow-xl w-[420px]  h-[900px] border border-white/30 transition-all animate-slideUp overflow-hidden">
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[800px] pr-2 mt-[50px]">
          <h2 className="text-xl font-semibold text-white -mt-4 text-center">
            Customize Your Gig
          </h2>

          {/* Font Selection */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">Font:</label>
            <select
              value={customization.font}
              onChange={(e) =>
                setCustomization((prev) => ({ ...prev, font: e.target.value }))
              }
              className="w-full p-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none hover:bg-white/20 transition title h-[36px]"
            >
              {fonts.map((font) => (
                <option key={font} value={font} className="text-black">
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Color Selection */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">Font Color:</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 shadow-md hover:scale-110 ${
                    customization.fontColor === color
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setCustomization((prev) => ({ ...prev, fontColor: color }))
                  }
                ></div>
              ))}
            </div>
          </div>

          {/* Background Color Selection */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">
              Background Color:
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 shadow-md hover:scale-110 ${
                    customization.backgroundColor === color
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      backgroundColor: color,
                    }))
                  }
                ></div>
              ))}
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="logo"
              className="block text-sm text-white mb-1 bg-neutral-600 rounded-md max-w-[200px] p-2"
            >
              {!isUploading ? (
                <span className="flex gap-1 items-center justify-between">
                  Choose Logo <BsCameraFill />
                </span>
              ) : (
                <div className="flex gap-2 items-center">
                  <CircularProgress
                    size={17}
                    sx={{ color: "white", fontBold: "500" }}
                  />
                  <div className="card2 h-[18px]">
                    <div className="loaderin2">
                      <div className="words2">
                        <span className="word2">Creating</span>
                        <span className="word2">Your</span>
                        <span className="word2">Avatar</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </label>
            <input
              type="file"
              id="logo"
              placeholder="Paste Image URL"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
          </div>

          {/* Live Preview */}
          <div
            className="mt-4 p-4 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg text-center transition hover:scale-105"
            style={{
              backgroundColor: customization.backgroundColor,

              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "120px",
            }}
          >
            {!customization?.fontColor &&
            !customization?.font &&
            !customization?.backgroundColor &&
            !logo ? (
              <>
                {" "}
                <h3 className="text-lg font-semibold">Gig Preview</h3>
                <p className="text-sm">See how your gig card looks live.</p>
              </>
            ) : (
              <Box className="flex flex-col gap-1">
                <div className="flex  justify-between items-center">
                  <div className="flex flex-col">
                    <span className="flex gap-1">
                      <span style={{ fontSize: "10px", color: "orange" }}>
                        gigtitle:
                      </span>
                      <span
                        style={{
                          color: customization.fontColor,
                          fontSize: "12px",
                          fontFamily: customization.font,
                        }}
                      >
                        gig title
                      </span>
                    </span>
                    <span className="flex gap-1">
                      <span style={{ fontSize: "10px", color: "orange" }}>
                        location:
                      </span>
                      <span
                        style={{
                          color: customization.fontColor,
                          fontSize: "12px",
                          fontFamily: customization.font,
                        }}
                      >
                        location information
                      </span>
                    </span>
                    <span className="flex gap-1">
                      <span style={{ fontSize: "10px", color: "orange" }}>
                        price:
                      </span>
                      <span
                        style={{
                          color: customization.fontColor,
                          fontSize: "12px",
                          fontFamily: customization.font,
                        }}
                        className={`font-${customization.font} text-[${customization.fontColor}]`}
                      >
                        price information
                      </span>
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    className="h-[20px]  text-[11px] min-w-[41px] whitespace-nowrap"
                  >
                    Book Gig
                  </Button>
                </div>
                <Divider className="w-[full] h-[3px] bg-[#494949] mt-2" />
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="text-red-600 gigtitle">Status:</span>
                    <span className="text-gray-200 bg-blue-400  rounded-xl h-[20px]  px-2 gigtitle font-sans">
                      Available
                    </span>
                  </span>
                  {
                    <div className="h-[27px] w-[27px]  rounded-full bg-gray-400 flex justify-center items-center">
                      <Image
                        src={
                          logo
                            ? logo
                            : "https://www.svgrepo.com/show/4460/calendar.svg"
                        }
                        className="h-[24px] w-[24px] rounded-full"
                        alt="C"
                        width={24}
                        height={24}
                      />
                    </div>
                  }
                </div>
              </Box>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition hover:scale-105 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigCustomization;
