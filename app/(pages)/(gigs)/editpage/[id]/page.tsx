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
import { ArrowDown01Icon, EyeIcon, EyeOff } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { fileupload } from "@/hooks/fileUpload";
import useStore from "@/app/zustand/useStore";
import { Button } from "@/components/ui/button";
import GigCustomization from "@/components/gig/GigCustomization";
import { useParams } from "next/navigation";
import { useGetGigs } from "@/hooks/useGetGig";
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
  const [selectedDate] = useState<Date | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageUrl, setUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const { setRefetchData, currentgig } = useStore();
  const { user } = useCurrentUser(userId || null);
  const {} = useGetGigs(id as string | null);

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
  });
  useEffect(() => {
    if (currentgig) {
      setGigs((prev) => ({
        ...prev,
        ...currentgig,
      }));
    }
  }, [currentgig]);
  const [userinfo, setUserInfo] = useState<UserInfo>({
    prefferences: [],
  });
  const [bussinesscat, setBussinessCategory] = useState<bussinesscat>("full");
  // const [errors, setErrors] = useState<string[]>([]);
  // const [success, setSuccess] = useState<boolean>(false);
  const [showduration, setshowduration] = useState<boolean>(false);

  // const minDate = new Date("2020-01-01");
  // const maxDate = new Date("2026-01-01");

  // const handleDate = (date: Date | null) => {
  //   setSelectedDate(date);
  // };

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

  // submit your gig
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
          date: selectedDate,
          to: `${gigInputs.end}${gigInputs.durationto}`,
          from: `${gigInputs.start}${gigInputs.durationfrom}`,
          postedBy: user?._id,
          bussinesscat: bussinesscat,
          font: gigcustom.font,
          fontColor: gigcustom.fontColor,
          backgroundColor: gigcustom.backgroundColor,
          logo: imageUrl,
        }),
      });
      const data = await res.json();

      if (data.gigstatus === "true") {
        toast.success(data?.message, {
          position: "top-center",
        });
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
        });
        setUserInfo({ prefferences: [] });
        setBussinessCategory("");
      }
      if (data.gigstatus === "false") {
        toast.error(data?.message, {
          position: "top-center",
          // autoClose: 3000, // 5 seconds
          // hideProgressBar: false,
          // closeOnClick: true,
          // pauseOnHover: true,
          // draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="h-[100vh]  mt-[20px] py-3 overflow-y-hidden  bg-gray-900 w-[90%] mx-auto px-2"
      >
        <h6 className=" text-gray-300 font-sans text-center underline mb-3 ">
          Enter info to update a gig
        </h6>{" "}
        <div className="flex w-full justify-between">
          <select
            onChange={handleBussinessChange}
            name="durationfrom"
            value={bussinesscat ? bussinesscat : ""}
            className="mb-5 w-[130px]  bg-neutral-300 h-[30px] rounded-md text-[12px] flex justify-center items-center p-2 font-mono"
          >
            <option value="full">Full Band</option>
            <option value="personal">Individual</option>
            <option value="other">other...</option>
          </select>{" "}
          <div onClick={() => setShowCustomization(true)}>
            <h1 className="text-sm text-gray-300 bg-gradient-to-tr from-orange-300 via-green-800 to-yellow-900  py-1 px-2 rounded-md cursor-pointer">
              Customize your Gig Card
            </h1>
          </div>
        </div>
        <div className="w-full  gap-4">
          <div
            className={
              !secretreturn
                ? `flex flex-col gap-1  `
                : `flex flex-col gap-1 h-[70px] `
            }
          >
            <div className="flex my-5items-center gap-2">
              <input
                autoComplete="off"
                onChange={handleInputChange}
                name="secret"
                value={gigInputs?.secret}
                type={!secretpass ? "password" : "text"}
                placeholder="Enter secret,  NB://(valid only once)"
                className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-7 focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
              />{" "}
              {secretpass ? (
                <EyeOff
                  onClick={() => setSecretPass((prev) => !prev)}
                  size="18px"
                />
              ) : (
                <EyeIcon
                  onClick={() => setSecretPass((prev) => !prev)}
                  size="18px"
                />
              )}
            </div>
            {secretreturn && (
              <h6 className="text-red-500 text-[13px] -mt-2">{secretreturn}</h6>
            )}
          </div>
          <input
            autoComplete="off"
            onChange={handleInputChange}
            name="title"
            value={gigInputs?.title}
            type="text"
            placeholder="Enter any title"
            className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-5  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
          />{" "}
          <Textarea
            onChange={handleInputChange}
            name="description"
            value={gigInputs?.description}
            style={{ resize: "none", height: "fit-content" }}
            className="min-h-[70px] py-2 mb-5 font-mono  bg-zinc-700 border-2 border-neutral-400 text-neutral-300 px-3 "
            placeholder=" Enter description e.g what songs or the vybe expected in the event/show"
          />
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter phone no: "
            className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-5  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
            onChange={handleInputChange}
            name="phoneNo"
            value={gigInputs?.phone}
          />{" "}
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter price range expected  "
            className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-5  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
            onChange={handleInputChange}
            name="price"
            value={gigInputs?.price}
          />{" "}
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter location  "
            className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-5  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300 w-full"
            onChange={handleInputChange}
            name="location"
            value={gigInputs?.location}
          />{" "}
          <>
            {bussinesscat === "other" ? (
              <h6 className="choice mb-2 text-gray-400">
                Choose the setUp of the show
              </h6>
            ) : (
              ""
            )}
            {bussinesscat === "personal" && (
              <select
                onChange={handleInputChange}
                name="category"
                value={gigInputs?.category}
                className="mb-2 w-full text-neutral-400  bg-zinc-700 border-2 border-neutral-400   h-[40px] rounded-md p-3 text-[12px]  font-mono"
              >
                <option value="piano">Piano</option>
                <option value="guitar">Guitar</option>
                <option value="bass">Bass Guitar</option>
                <option value="saxophone">Saxophone</option>
                <option value="violin">Violin</option>
                <option value="ukulele">Ukulele</option>{" "}
                <option value="harp">Harp</option>
                <option value="xylophone">Xylophone</option>{" "}
                <option value="cello">Cello</option>
                <option value="percussion">Percussion</option>{" "}
              </select>
            )}
            {bussinesscat === "other" && (
              <div className="h-[80px] rounded-lg shadow-xl gap-5  bg-zinc-700  p-2 choice flex flex-wrap">
                <div>
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="vocalist"
                    name="vocalist"
                    value="vocalist"
                  />
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="vocalist"
                  >
                    vocalist
                  </label>
                </div>
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="piano"
                    name="piano"
                    value="piano"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="piano"
                  >
                    Piano
                  </label>
                </div>
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="sax"
                    name="sax"
                    value="sax"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="sax"
                  >
                    Saxophone
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="guitar"
                    name="guitar"
                    value="guitar"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="guitar"
                  >
                    Guitar
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="drums"
                    name="drums"
                    value="drums"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="drums"
                  >
                    Drums
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="bass"
                    name="bass"
                    value="bass"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="bass"
                  >
                    Bass
                  </label>
                </div>
              </div>
            )}
          </>
          {showduration ? (
            <div className="flex my-5items-center flex-col gap-2 mt-5 bg-gray-800 pt-2 rounded-md relative ">
              {" "}
              <div
                className="text-white absolute right-2 -top-1 text-[23px]"
                onClick={() => setshowduration(false)}
              >
                &times;
              </div>
              <Box className="flex items-center flex-col  mt-4">
                <div className="flex my-5items-center gap-3">
                  {" "}
                  <h6 className="mb-2 w-[50px] text-white font-mono flex justify-center text-[11px]">
                    from:
                  </h6>
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder=" Time e.g 10 means 10:00 "
                    className="mb-2 p-3 focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-800 w-[124px] text-[11px]"
                    onChange={handleInputChange}
                    name="start"
                    value={gigInputs?.start}
                  />{" "}
                  <select
                    onChange={handleInputChange}
                    name="durationfrom"
                    value={gigInputs?.durationfrom}
                    className="mb-2 w-[55px] bg-zinc-800 text-gray-200 h-[34px] rounded-full text-[11px] flex justify-center items-center p-2 font-mono"
                  >
                    <option value="pm">PM</option>
                    <option value="am">AM</option>
                  </select>{" "}
                </div>
                <div className="flex my-5items-center gap-3 ">
                  <h6 className="mb-2 w-[50px] text-white font-mono flex justify-center text-[11px]">
                    to:
                  </h6>
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder=" Time e.g 10 means 10:00 "
                    className="mb-2 p-3 focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-800 w-[124px] text-[11px]"
                    onChange={handleInputChange}
                    name="end"
                    value={gigInputs?.end}
                  />{" "}
                  <select
                    onChange={handleInputChange}
                    name="durationto"
                    value={gigInputs?.durationto}
                    className="mb-2 w-[55px] bg-zinc-800 text-gray-200 h-[34px] rounded-full text-[11px] flex justify-center items-center p-2 font-mono"
                  >
                    <option value="pm">PM</option>
                    <option value="am">AM</option>
                  </select>{" "}
                </div>
              </Box>
              {/* date here */}
              {/* <DatePicker
              selected={selectedDate}
              onChange={handleDate}
              dateFormat="DD/MM/YYYY"
              minDate={minDate}
              maxDate={maxDate}
              title="Set Event Date"
              className="font-mono  h-[35px] text-[12px]  bg-zinc-800 border-2 border-neutral-400 mb-5  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300 w-[300px]"
            /> */}
            </div>
          ) : (
            <Box
              onClick={() => setshowduration(true)}
              className="flex justify-between items-center w-[70%] mt-3   mx-auto bg-gray-500 py-1 px-4 rounded-md"
            >
              <h6 className="text-[14px] text-gray-200 font-sans">
                Enter Duration
              </h6>
              <ArrowDown01Icon
                size="22"
                style={{
                  color: "lightgray",
                }}
              />
            </Box>
          )}
          <div className="w-full flex justify-center">
            <Button
              variant="update"
              type="submit"
              className="mt-4 w-[60%] h-[30px] text-[12px]"
              disabled={isLoading}
            >
              {!isLoading ? (
                "Update Gig"
              ) : (
                <CircularProgress size="14px" sx={{ color: "white" }} />
              )}
            </Button>
          </div>
        </div>{" "}
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
  );
};

export default EditPage;

// const [open, setOpen] = useState<boolean>(true);
// const router = useRouter();
// const handleClose = () => {
//   router.back();
//   setOpen(false);
// };
// return (
//   <Dialog open={open} onOpenChange={handleClose}></Dialog>
