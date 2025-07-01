import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useStore from "@/app/zustand/useStore";
import { Box, Chip, Typography, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { colors } from "@/utils";

const calculateTimeLeft = (targetDate: Date) => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
};
const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.paper,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  minWidth: "120px",
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: "right",
  flexGrow: 1,
  paddingLeft: theme.spacing(2),
}));

const GigDescription = ({}) => {
  const { setIsDescriptionModal, currentgig } = useStore();
  console.log(currentgig);
  const [timeLeft, setTimeLeft] = useState(() => {
    // Use gig's creation date plus one month

    const targetDate = new Date(currentgig?.scheduleDate);
    targetDate.setMonth(targetDate.getMonth() + 1);
    return calculateTimeLeft(targetDate);
  });

  useEffect(() => {
    const createdAt = new Date(currentgig.createdAt);
    const targetDate = new Date(createdAt);
    targetDate.setMonth(targetDate.getMonth() + 1);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentgig?.createdAt]);

  const showPriceRangeAndCurrency =
    currentgig?.pricerange === "thousands"
      ? `${currentgig?.price}k ${currentgig?.currency} `
      : currentgig?.pricerange === "hundreds"
      ? `${currentgig?.price},00 ${currentgig?.currency} `
      : currentgig?.pricerange === "tensofthousands"
      ? `${currentgig?.price}0000 ${currentgig?.currency} `
      : currentgig?.pricerange === "hundredsofthousands"
      ? `${currentgig?.price},00000 ${currentgig?.currency} `
      : `${currentgig?.price} ${currentgig?.currency} `;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm -mt-[145px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-gray-800 text-white w-[90vw] max-w-2xl rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: "primary.light",
            padding: 2,
            display: "flex",
            justifyContent:
              currentgig?.isPending === true ? "space-around" : "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "primary.contrastText" }}
          >
            Gig Details
          </Typography>
          {currentgig?.isPending === true && (
            <div>
              {!timeLeft.expired ? (
                <div className="text-[15px] text-cyan-200 font-bold font-sans mt-1 flex items-center  ">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                  {timeLeft.seconds}s
                </div>
              ) : (
                <div className="text-[11px] text-red-400/90 mt-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Gig expired
                </div>
              )}
            </div>
          )}
          <IconButton
            onClick={() => setIsDescriptionModal(false)}
            sx={{ color: "primary.contrastText" }}
            aria-label="Close modal"
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            padding: 3,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.main",
              borderRadius: "3px",
            },
          }}
        >
          {/* Basic Information Section */}
          <Box sx={{ mb: 3 }}>
            <Box className="flex justify-between items-center">
              <Chip
                label="Basic Information"
                color="primary"
                sx={{ mb: 2, fontWeight: 600 }}
              />
              <p className="mb-2">
                <span className="text-white title">Status :</span>
                <span
                  className={`${
                    currentgig?.isPending === false
                      ? "text-green-300 title"
                      : "text-red-500 title"
                  }`}
                >
                  {currentgig?.isPending === false ? "All Good" : "Pending"}
                </span>
              </p>
            </Box>
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                overflow: "hidden",
              }}
            >
              <DetailItem>
                <DetailLabel variant="body2">Gig Type</DetailLabel>
                <DetailValue
                  variant="body2"
                  sx={{ textTransform: "capitalize" }}
                >
                  {currentgig?.bussinesscat}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel variant="body2">Pay</DetailLabel>
                <DetailValue variant="body2" sx={{ fontWeight: 500 }}>
                  {showPriceRangeAndCurrency}
                </DetailValue>
              </DetailItem>
            </Box>
          </Box>
          {/* Contact Information Section */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label="Contact Information"
              color="secondary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                overflow: "hidden",
              }}
            >
              <DetailItem>
                <DetailLabel variant="body2">Contact</DetailLabel>
                <DetailValue
                  variant="body2"
                  sx={{ filter: "blur(4px)", "&:hover": { filter: "none" } }}
                >
                  {currentgig?.phone}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel variant="body2">Posted By</DetailLabel>
                <DetailValue
                  variant="body2"
                  className="
              "
                >
                  {currentgig?.postedBy?.organization}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel variant="body2">Username</DetailLabel>
                <DetailValue variant="body2">
                  {currentgig?.postedBy?.username}
                </DetailValue>
              </DetailItem>
            </Box>
          </Box>
          {/* Description Section */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label="Description"
              sx={{
                mb: 2,
                fontWeight: 600,
                backgroundColor: "text.primary",
                color: "background.paper",
              }}
            />
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                padding: 2.5,
              }}
            >
              <Typography
                variant="body2"
                paragraph
                className="text-gray-500 animate-bounce"
              >
                {currentgig?.description}
              </Typography>
            </Box>
          </Box>
          {/* Category-Specific Information */}
          {currentgig?.bussinesscat === "personal" && currentgig?.category && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label="Instrument Details"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "success.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography
                  variant="body2"
                  className="text-gray-500 animate-bounce"
                >
                  <strong>Instrument:</strong> {currentgig?.category}
                </Typography>
              </Box>
            </Box>
          )}
          {currentgig?.bussinesscat === "full" && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label="Band Requirements"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "warning.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography variant="body2" className="text-gray-500 ">
                  Full band required including vocalists, instrumentalists, and
                  supporting musicians.
                </Typography>
              </Box>
            </Box>
          )}
          {currentgig?.bussinesscat === "mc" && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label="Mc Requirements"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "warning.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography variant="body2" className="text-gray-500 ">
                  An Mc required(Master of Ceremony)
                </Typography>
                <Typography variant="body2" className="text-gray-500 ">
                  Mc for:{" "}
                  <span className="text-[14px] text-cyan-400 text-center my-3">
                    {currentgig?.mcType} Event
                  </span>{" "}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-500 flex flex-col "
                >
                  <span className="text-[14px] text-zinc-700 text-center my-3">{`Mc should be fluent in:`}</span>

                  <span>
                    {currentgig?.mcLanguages.split(",").map((d) => {
                      return (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            listStyleType: "disc",
                          }}
                          className="text-[14px] text-orange-800 flex flex-col gap-2"
                          key={d}
                        >
                          <li>{d}</li>
                        </ul>
                      );
                    })}
                  </span>
                </Typography>
              </Box>
            </Box>
          )}{" "}
          {currentgig?.bussinesscat === "dj" && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label="Dj Requirements"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "warning.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <h5 className="text-gray-500 text-[13px] ">A Dj needed</h5>
                <h5 className="text-gray-500 text-[13px] ">
                  Preffered Gear:
                  <span className="text-rose-500 animate-bounce">
                    {" "}
                    {currentgig?.djEquipment}
                  </span>
                </h5>{" "}
                <Typography
                  variant="body2"
                  className="text-gray-500 flex flex-col "
                >
                  <span className="text-[14px] text-zinc-700 text-center my-3">{`We're looking for a Dj good in:`}</span>

                  <span>
                    {currentgig?.djGenre.split(",").map((d) => {
                      return (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            listStyleType: "disc",
                          }}
                          className="text-[14px] text-amber-900 flex flex-col gap-2"
                          key={d}
                        >
                          <li>{d}</li>
                        </ul>
                      );
                    })}
                  </span>
                </Typography>
              </Box>
            </Box>
          )}
          {currentgig?.bussinesscat === "other" &&
            currentgig?.bandCategory &&
            currentgig?.bandCategory?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Chip
                  label="Band Selection"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    backgroundColor: "info.dark",
                    color: "background.paper",
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 1,
                    padding: 2,
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {[...new Set(currentgig.bandCategory)].map((band, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body2"
                          className="text-rose-500 animate-bounce"
                        >
                          {band}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}
          {currentgig?.bussinesscat === "vocalist" && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label="Vocalist Selection"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "info.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <span className="text-sm text-neutral-500">
                  Vocalist Needed
                </span>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <span className="text-amber-700 text-[11px]">
                    They should ne able to do:
                  </span>
                  {[...new Set(currentgig.vocalistGenre)].map((band, idx) => (
                    <li key={idx}>
                      <Typography
                        variant="body2"
                        className="text-rose-500 animate-bounce"
                      >
                        {band}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Box>
          )}
          {currentgig?.gigtimeline === "once" && (
            <Box className="my-6">
              <Chip
                label="Schedule"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "error.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography
                  variant="body2"
                  className="text-black flex flex-col gap-3"
                >
                  <strong style={{ color: "#ff5252" }}>
                    <span className="font-bold text-[13px]">
                      Happening on!!!
                    </span>{" "}
                    {moment(currentgig?.date).format("MMMM Do YYYY")}
                  </strong>
                  <strong
                    style={{ color: colors[4] }}
                    className="flex flex-col"
                  >
                    <span>StartTime:{currentgig?.time?.from}</span>
                    <span>FinishTime:{currentgig?.time?.to}</span>
                  </strong>
                </Typography>
              </Box>
            </Box>
          )}
          {/* Schedule Information */}
          {currentgig?.gigtimeline === "weekly" && (
            <Box className="my-6">
              <Chip
                label="Schedule"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "error.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography variant="body2" className="text-black">
                  <strong style={{ color: "#ff5252" }}>
                    Every week on {currentgig?.day}
                  </strong>
                </Typography>
              </Box>
            </Box>
          )}
          {currentgig?.gigtimeline === "other" && (
            <Box className="my-6">
              <Chip
                label="Schedule"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  backgroundColor: "error.dark",
                  color: "background.paper",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography variant="body2" className="text-black">
                  <strong style={{ color: "#ff5252" }}>
                    {currentgig?.otherTimeline} Every {currentgig?.day}
                  </strong>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </motion.div>
    </div>
  );
};

export default GigDescription;
