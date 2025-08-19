import React from "react";
import { Button } from "../ui/button";
import { Box, CircularProgress, Divider } from "@mui/material";
import { BsCameraFill } from "react-icons/bs";
import { colors, fonts } from "@/utils";
import "../loaders/word.css";
import altlogo from "../../public/assets/png/logo-no-background.png";
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
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Polygon Background */}
      <div
        onClick={closeModal}
        className="absolute right-4 top-[120px] text-gray-200 z-50 text-[30px]"
      >
        &times;
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Modal */}
      <div className=" -mt-9 relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[450px] max-h-[90vh] border border-white/20 transition-all animate-slideUp overflow-hidden">
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[80vh] pr-2">
          {/* Font Selection */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">Font:</label>
            <select
              value={customization.font}
              onChange={(e) =>
                setCustomization((prev) => ({ ...prev, font: e.target.value }))
              }
              className="w-full p-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40 hover:bg-white/20 transition h-[36px]"
            >
              {fonts.map((font) => (
                <option key={font} value={font} className="text-black">
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Color Selection */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">
              Font Color:
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 shadow-md hover:scale-110 ${customization.fontColor === color
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
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">
              Background Color:
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 shadow-md hover:scale-110 ${customization.backgroundColor === color
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
          <div className="mb-6">
            <label htmlFor="logo" className="block text-sm text-white/80 mb-2">
              {!isUploading ? (
                <span className="flex gap-2 items-center justify-center bg-neutral-700/50 rounded-md p-2 hover:bg-neutral-700/70 transition cursor-pointer">
                  Choose Logo <BsCameraFill className="text-white/80" />
                </span>
              ) : (
                <div className="flex gap-2 items-center justify-center bg-neutral-700/50 rounded-md p-2">
                  <CircularProgress
                    size={17}
                    sx={{ color: "white", fontWeight: "500" }}
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
            className="mt-6 p-6 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg text-center transition hover:scale-105 relative overflow-hidden"
            style={{
              backgroundColor: customization.backgroundColor,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "150px",
            }}
          >
            {/* Polygon Shape Overlay */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-2xl"></div>

            {!customization?.fontColor &&
              !customization?.font &&
              !customization?.backgroundColor &&
              !logo ? (
              <>
                <h3 className="text-lg font-semibold text-white/80">
                  Gig Preview
                </h3>
                <p className="text-sm text-white/60">
                  See how your gig card looks live.
                </p>
              </>
            ) : (
              <Box className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
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
                      >
                        price information
                      </span>
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    className="h-[20px] text-[11px] min-w-[41px] whitespace-nowrap"
                  >
                    Book Gig
                  </Button>
                </div>
                <Divider className="w-full h-[2px] bg-white/20 mt-2" />
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="text-red-600 text-sm">Status:</span>
                    <span className="text-white bg-blue-500 rounded-full px-2 py-1 text-xs">
                      Available
                    </span>
                  </span>
                  <div className="h-[27px] w-[27px] rounded-full bg-gray-400 flex justify-center items-center">
                    <img
                      src={logo ? logo : typeof altlogo === 'string' ? altlogo : altlogo.src}
                      className="h-[24px] w-[24px] rounded-full"
                      alt="C"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </Box>
            )}
          </div>
        </div>

        {/* Close Button */}
      </div>
    </div>
  );
};

export default GigCustomization;
