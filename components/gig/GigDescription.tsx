import React from "react";
import { motion } from "framer-motion";
import useStore from "@/app/zustand/useStore";
import { Box, Chip, Typography, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { styled } from "@mui/material/styles";

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

const GigDescription = () => {
  const { setIsDescriptionModal, currentgig } = useStore();
  console.log(currentgig);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm -mt-[140px]">
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
            backgroundColor: "primary.dark",
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
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
            <Chip
              label="Basic Information"
              color="primary"
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
                <DetailLabel variant="body2">Gig Type</DetailLabel>
                <DetailValue
                  variant="body2"
                  sx={{ textTransform: "capitalize" }}
                >
                  {currentgig?.bussinesscat}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel variant="body2">Time</DetailLabel>
                <DetailValue variant="body2">
                  {currentgig?.time?.from} - {currentgig?.time?.to}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel variant="body2">Pay</DetailLabel>
                <DetailValue variant="body2" sx={{ fontWeight: 500 }}>
                  {currentgig?.price}
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
                  {currentgig?.postedBy?.email}
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
                <Typography variant="body2" className="text-black">
                  <strong style={{ color: "#ff5252" }}>
                    Every week on {currentgig?.date?.toLocaleDateString()}
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
