"use client";
import { Textarea } from "flowbite-react";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
} from "react";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Box, CircularProgress } from "@mui/material";
import {
  ArrowDown,
  ArrowDown01Icon,
  ArrowUp,
  BriefcaseConveyorBelt,
  EyeIcon,
  EyeOff,
  InfoIcon,
  Timer,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { fileupload } from "@/hooks/fileUpload";
import useStore from "@/app/zustand/useStore";
import { Button } from "@/components/ui/button";
import GigCustomization from "@/components/gig/GigCustomization";
import { useParams, useRouter } from "next/navigation";
import { useGetGigs } from "@/hooks/useGetGig";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FaComment } from "react-icons/fa";
import { days } from "@/data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { fonts } from "@/utils";
// import useStore from "@/app/zustand/useStore";
// import { useAuth } from "@clerk/nextjs";
interface GigInputs {
  title: string;
  description: string;
  phone: string;
  price: string;
  category: string;
  location: string;
  secret: string;
  end: string;
  start: string;
  durationto: string;
  durationfrom: string;
  bussinesscat: string;
  otherTimeline: string;
  gigtimeline: string;
  day: string;
  date: string; // Update to accept both types
}
interface CustomProps {
  fontColor: string;
  font: string;
  backgroundColor: string;
}

interface UserInfo {
  prefferences: string[];
}
type bussinesscat = string | null;

const EditPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secretpass, setSecretPass] = useState<boolean>(false);
  const [showcustomization, setShowCustomization] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Changed to useState

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageUrl, setUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const { setRefetchData, currentgig } = useStore();
  const { user } = useCurrentUser(userId || null);
  const {} = useGetGigs(id as string | null);

  const [showCategories, setshowCategories] = useState<{
    title: boolean;
    description: boolean;
    business: boolean;
    gtimeline: boolean;
    gduration: boolean;
    othergig: boolean;
  }>({
    title: false,
    description: false,
    business: false,
    gtimeline: false,
    othergig: false,
    gduration: false,
  });
  const [gigcustom, setGigCustom] = useState<CustomProps>({
    fontColor: "",
    font: "",
    backgroundColor: "",
  });
  const [secretreturn] = useState<string>("");
  const [gigInputs, setGigs] = useState<GigInputs>({
    title: "",
    description: "",
    phone: "",
    price: "",
    category: "",
    location: "",
    secret: "",
    end: "",
    start: "",
    durationto: "pm",
    durationfrom: "am",
    bussinesscat: "personal",
    otherTimeline: "",
    gigtimeline: "",
    day: "",
    date: "", // Added date field
  });
  useEffect(() => {
    if (currentgig && !gigInputs.title) {
      const dateValue = currentgig.date
        ? new Date(currentgig.date).toISOString()
        : "";

      setGigs((prev) => ({
        ...prev,
        ...currentgig,
        date: dateValue,
      }));

      if (currentgig.date) {
        setSelectedDate(new Date(currentgig.date));
      }
    }
  }, [currentgig, gigInputs?.title]);
  console.log(currentgig);
  const [userinfo, setUserInfo] = useState<UserInfo>({
    prefferences: [],
  });
  const [bussinesscat, setBussinessCategory] = useState<bussinesscat>("full");
  // const [errors, setErrors] = useState<string[]>([]);
  // const [success, setSuccess] = useState<boolean>(false);
  const [showduration, setshowduration] = useState<boolean>(false);

  const minDate = new Date("2020-01-01");
  const maxDate = new Date("2026-01-01");

  const handleDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setGigs((prev) => ({
        ...prev,
        date: date.toISOString(),
      }));
    }
  };

  // handle the image upload to cloudinary

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const dep = "image";
      // Check if the file is a video
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];

      fileupload(
        event,
        (file: string) => {
          // Ensure the file is a valid string before updating state
          if (file) {
            setUrl(file); // setUrl expects a string, ensure it's not undefined
          }
        },
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => {
          // Handle fileUrl, only set if it's a valid string (not undefined)
          if (file) {
            setFileUrl(file); // setFileUrl expects a string, ensure it's not undefined
          }
        },
        setIsUploading,
        dep,
        user,
        setRefetchData
      );
      console.log(imageUrl);
    },
    [fileUrl]
  );

  //

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGigs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleBussinessChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBussinessCategory(e.target.value);
  };

  // only used when you choose other
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setUserInfo((prev) => ({
      prefferences: checked
        ? [...prev.prefferences, value]
        : prev.prefferences.filter((item) => item !== value),
    }));
  };
  //
  const [editMessage, setEditMessage] = useState("");
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // submit your gig
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newdate =
      gigInputs.gigtimeline === "weekly"
        ? ""
        : gigInputs.gigtimeline === "other"
        ? ""
        : gigInputs?.gigtimeline;

    const newday = gigInputs.gigtimeline === "once" ? "" : gigInputs.day;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/gigs/editgig/${currentgig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: gigInputs.title,
          description: gigInputs.description,
          phoneNo: gigInputs.phone,
          price: gigInputs.price,
          category: gigInputs.category,
          bandCategory: userinfo.prefferences,
          location: gigInputs.location,
          secret: gigInputs.secret,
          date: newdate,
          to: `${gigInputs.end}${gigInputs.durationto}`,
          from: `${gigInputs.start}${gigInputs.durationfrom}`,
          postedBy: user?._id,
          bussinesscat: bussinesscat,
          font: gigcustom.font,
          fontColor: gigcustom.fontColor,
          backgroundColor: gigcustom.backgroundColor,
          logo: imageUrl,
          otherTimeline: gigInputs.otherTimeline,
          gigtimeline: gigInputs.gigtimeline,
          day: newday,
        }),
      });
      const data = await res.json();

      if (data.gigstatus === "true") {
        setEditMessage(data?.message);
        setError(false);
        setIsVisible(true);
        // Reset form fields
        setGigs({
          title: "",
          description: "",
          phone: "",
          price: "",
          category: "",
          location: "",
          secret: "",
          end: "",
          start: "",
          durationto: "pm",
          durationfrom: "am",
          bussinesscat: "personal",
          otherTimeline: "",
          gigtimeline: "",
          day: "",
          date: "",
        });
        setUserInfo({ prefferences: [] });
        setBussinessCategory("");
      }
      if (data.gigstatus === "false") {
        setError(true);

        setEditMessage(data.message);
        setIsVisible(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setEditMessage("An error occurred while updating the gig");
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const handleClose = () => {
    router.back();
    setOpen(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (editMessage && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setEditMessage("");
      }, 4500); // Hide after 4.5 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [editMessage, isVisible]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="h-[88vh] mt-[20px] py-3 overflow-y-hidden bg-gray-900 w-[90%] mx-auto px-2 backdrop-blur-lg bg-opacity-50">
        {isVisible && editMessage && (
          <motion.div
            initial={{ opacity: 0, y: "-200px" }}
            exit={{
              opacity: 0,
              y: "-200px",
              transition: { duration: 0.9 },
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.9 },
            }}
            className="absolute top-10 p-4 rounded-md left-0 right-0 h-fit w-[80%] mx-auto z-9999 flex justify-center items-center bg-zinc-800 shadow-md shadow-orange-200 "
          >
            <span
              className={`flex justify-center  ${
                error ? "text-red-300 " : "text-green-300"
              }`}
              style={{
                fontFamily: fonts[30],
              }}
            >
              {editMessage}
            </span>
          </motion.div>
        )}
        <DialogTitle className=" text-gray-300 font-sans text-center underline mb-3 ">
          Enter info to update a gig
        </DialogTitle>{" "}
        <div>
          <form
            onSubmit={onSubmit}
            className="h-[100vh] bg-gray-900 px-4 py-6 overflow-y-auto w-full" // Ensure overflow-y-auto is here
          >
            <div className="h-[100vh] overflow-y-auto">
              <h6 className="text-gray-100 font-sans text-center text-lg font-semibold mb-6">
                Enter info to create a gig
              </h6>
              <div className="flex w-full justify-between items-center mb-6">
                <select
                  onChange={handleBussinessChange}
                  name="durationfrom"
                  value={bussinesscat ? bussinesscat : ""}
                  className="w-[150px] bg-gray-700 text-gray-100 h-[40px] rounded-lg text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full">Full Band</option>
                  <option value="personal">Individual</option>
                  <option value="other">Other...</option>
                </select>
                <div
                  onClick={() => setShowCustomization(true)}
                  className="cursor-pointer"
                >
                  <h1 className="text-sm text-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all ml-3">
                    Customize your Gig Card
                  </h1>
                </div>
              </div>
              <div className="w-full space-y-4">
                <div
                  className={!secretreturn ? `space-y-4` : `space-y-4 h-[70px]`}
                >
                  <div
                    className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                    onClick={() =>
                      setshowCategories({
                        title: !showCategories.title,
                        description: false,
                        business: false,
                        gtimeline: false,
                        othergig: true,
                        gduration: false,
                      })
                    }
                  >
                    Title Information
                    <FaComment size="20" className="text-gray-400" />
                  </div>
                  {showCategories.title && (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center rounded-lg bg-gray-300 p-2">
                        <input
                          autoComplete="off"
                          onChange={handleInputChange}
                          name="secret"
                          value={gigInputs?.secret}
                          type={!secretpass ? "password" : "text"}
                          placeholder="Enter secret (valid only once)"
                          className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
                        />
                        {secretpass ? (
                          <EyeOff
                            onClick={() => setSecretPass((prev) => !prev)}
                            size="18px"
                            className="text-gray-400 cursor-pointer"
                          />
                        ) : (
                          <EyeIcon
                            onClick={() => setSecretPass((prev) => !prev)}
                            size="18px"
                            className="text-gray-400 cursor-pointer"
                          />
                        )}
                      </div>
                      <input
                        autoComplete="off"
                        onChange={handleInputChange}
                        name="title"
                        value={gigInputs?.title}
                        type="text"
                        placeholder="Enter a title"
                        className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {secretreturn && (
                    <h6 className="text-red-500 text-sm -mt-2">
                      {secretreturn}
                    </h6>
                  )}
                </div>
                <div
                  className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                  onClick={() =>
                    setshowCategories({
                      title: false,
                      description: !showCategories.description,
                      business: false,
                      gtimeline: false,
                      othergig: true,
                      gduration: false,
                    })
                  }
                >
                  Description Information
                  <InfoIcon size="20" className="text-gray-400" />
                </div>
                {showCategories.description && (
                  <Textarea
                    onChange={handleInputChange}
                    name="description"
                    value={gigInputs?.description}
                    style={{ resize: "none", height: "fit-content" }}
                    className="min-h-[100px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description (e.g., songs or vibe expected at the event/show)"
                  />
                )}
                <div
                  className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                  onClick={() =>
                    setshowCategories({
                      title: false,
                      description: false,
                      business: !showCategories.business,
                      gtimeline: false,
                      othergig: true,
                      gduration: false,
                    })
                  }
                >
                  Business Information
                  <BriefcaseConveyorBelt size="20" className="text-gray-400" />
                </div>
                {showCategories.business && (
                  <div className="flex flex-col gap-4 w-full">
                    {" "}
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Enter phone number"
                      className="w-full bg-gray-300 text-gray800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="phoneNo"
                      value={gigInputs?.phone}
                    />
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Enter expected price range"
                      className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="price"
                      value={gigInputs?.price}
                    />
                  </div>
                )}
                <div
                  className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                  onClick={() =>
                    setshowCategories({
                      title: false,
                      description: false,
                      business: false,
                      gtimeline: !showCategories.gtimeline,
                      othergig: true,
                      gduration: false,
                    })
                  }
                >
                  Gig Timeline Information
                  <Timer size="20" className="text-gray-400" />
                </div>
                {showCategories.gtimeline && (
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {" "}
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Enter location"
                      className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="location"
                      value={gigInputs?.location}
                    />{" "}
                    <select
                      onChange={handleInputChange}
                      name="gigtimeline"
                      value={gigInputs.gigtimeline}
                      className="w-[150px] bg-gray-300 text-gray-800 h-[40px] rounded-lg text-xs px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> Gig Timeline </option>
                      <option value="once">
                        One Time(function,event,recording etc)
                      </option>
                      <option value="weekly">Every Week</option>
                      <option value="other">Other...</option>
                    </select>
                    {gigInputs?.gigtimeline === "other" && (
                      <div className="w-full flex justify-center items-center">
                        <input
                          autoComplete="off"
                          type="text"
                          placeholder="Enter other timeline details"
                          className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleInputChange}
                          name="otherTimeline"
                          value={gigInputs?.otherTimeline}
                          disabled={gigInputs?.durationfrom === "once"}
                          required={gigInputs?.durationfrom === "once"}
                        />
                      </div>
                    )}
                    <select
                      className="w-[150px] p-2 rounded-md bg-gray-300 text-gray-800 border-none focus:ring-0 text-[10px]"
                      value={gigInputs?.day}
                      onChange={handleInputChange}
                      name="day"
                    >
                      {days().map((i) => (
                        <option key={i?.id} value={i.val}>
                          {i?.name}
                        </option>
                      ))}
                    </select>
                    {gigInputs?.gigtimeline === "once" && (
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            handleDate(date);
                          }
                        }}
                        minDate={minDate}
                        maxDate={maxDate}
                        className="w-full bg-gray-300 text-gray-800 p-2 rounded-lg"
                        placeholderText="Select date"
                        isClearable
                      />
                    )}
                  </div>
                )}
                {bussinesscat === "other" && (
                  <h6
                    className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                    onClick={() =>
                      setshowCategories({
                        title: false,
                        description: false,
                        business: false,
                        gtimeline: false,
                        othergig: !showCategories.othergig,
                        gduration: false,
                      })
                    }
                  >
                    Choose the setup of the show
                    {showCategories.othergig ? (
                      <ArrowDown size="20" className="text-gray-400" />
                    ) : (
                      <ArrowUp size="20" className="text-gray-400" />
                    )}
                  </h6>
                )}
                {bussinesscat === "personal" && (
                  <select
                    onChange={handleInputChange}
                    name="category"
                    value={gigInputs?.category}
                    className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Category</option>
                    <option value="piano">Piano</option>
                    <option value="guitar">Guitar</option>
                    <option value="bass">Bass Guitar</option>
                    <option value="saxophone">Saxophone</option>
                    <option value="violin">Violin</option>
                    <option value="ukulele">Ukulele</option>
                    <option value="harp">Harp</option>
                    <option value="xylophone">Xylophone</option>
                    <option value="cello">Cello</option>
                    <option value="percussion">Percussion</option>
                  </select>
                )}
                {!showCategories?.othergig && (
                  <>
                    {bussinesscat === "other" && (
                      <div className="grid grid-cols-3 gap-1 bg-gray-300 p-4 rounded-lg px-2">
                        {[
                          "vocalist",
                          "piano",
                          "sax",
                          "guitar",
                          "drums",
                          "bass",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center space-x-2"
                          >
                            <input
                              onChange={handleChange}
                              type="checkbox"
                              id={item}
                              name={item}
                              value={item}
                              className="accent-blue-500"
                            />
                            <label
                              htmlFor={item}
                              className="text-gray-800 text-sm capitalize"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}{" "}
                  </>
                )}
                {showduration ? (
                  <div className="bg-gray-700 p-4 rounded-lg relative">
                    <div
                      className="text-white absolute right-2 top-2 text-xl cursor-pointer"
                      onClick={() => setshowduration(false)}
                    >
                      &times;
                    </div>
                    <Box className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h6 className="text-gray-100 text-sm w-[50px]">
                          From:
                        </h6>
                        <input
                          autoComplete="off"
                          type="text"
                          placeholder="Time (e.g., 10 means 10:00)"
                          className="w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleInputChange}
                          name="start"
                          value={gigInputs?.start}
                        />
                        <select
                          onChange={handleInputChange}
                          name="durationfrom"
                          value={gigInputs?.durationfrom}
                          className="w-[60px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pm">PM</option>
                          <option value="am">AM</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-4">
                        <h6 className="text-gray-100 text-sm w-[50px]">To:</h6>
                        <input
                          autoComplete="off"
                          type="text"
                          placeholder="Time (e.g., 10 means 10:00)"
                          className="w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleInputChange}
                          name="end"
                          value={gigInputs?.end}
                        />
                        <select
                          onChange={handleInputChange}
                          name="durationto"
                          value={gigInputs?.durationto}
                          className="w-[60px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pm">PM</option>
                          <option value="am">AM</option>
                        </select>
                      </div>
                    </Box>
                  </div>
                ) : (
                  <Box
                    onClick={() => setshowduration(true)}
                    className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                  >
                    <h6 className="text-gray-100 text-sm">Enter Duration</h6>
                    <ArrowDown01Icon size="20" className="text-gray-400" />
                  </Box>
                )}
                <div className="w-full flex justify-center mt-6">
                  <Button
                    variant="destructive"
                    type="submit"
                    className="w-[60%] h-[40px] text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      "Update Gig"
                    ) : (
                      <CircularProgress size="16px" sx={{ color: "white" }} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="h-full w-full relative">
            {showcustomization && (
              <GigCustomization
                customization={gigcustom}
                setCustomization={setGigCustom}
                closeModal={() => setShowCustomization(false)}
                logo={imageUrl}
                handleFileChange={handleFileChange}
                isUploading={isUploading}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPage;
