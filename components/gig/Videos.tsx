import React, { ChangeEvent, useCallback, useState } from "react";
import { motion } from "framer-motion";
// import { Textarea } from "flowbite-react";
import { fileupload } from "@/hooks/fileUpload";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { BsArrowLeftShort } from "react-icons/bs";
// import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { CircularProgress } from "@mui/material";
import { FetchResponse } from "@/types/giginterface";

interface videosProps {
  setShowVideo: (showvideo: boolean) => void;
  gigId: string;
}
const Videos = ({ setShowVideo, gigId }: videosProps) => {
  const [addvideo, setAddVideo] = useState<boolean>();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState({
    title: "",
    description: "",
  });
  const baseUrl = `/api/gigs/addvideo/${gigId}`;
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVideos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // post

  // const router = useRouter();
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataInfo = {
      media: videoUrl,
      title: videos.title,
      description: videos.description,
      postedBy: user?._id,
    };
    console.log("title from front End", videoUrl);
    console.log("description from front End", videos.title);
    console.log("media from front End", videos.description);
    console.log("postedBy from front End", user?._id);

    if (videoUrl) {
      try {
        setIsLoading(true);
        const res = await fetch(baseUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Correctly specify headers here
          },
          body: JSON.stringify(dataInfo),
        });

        const data: FetchResponse = await res.json();
        console.log(data);
        toast.success(data?.message);
        setVideos({ title: "", description: "" });
        setVideoUrl("");
        setFileUrl("");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    } else {
      alert("Please provide all required fields");
    }
  };
  console.log(videoUrl);
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      fileupload(
        event,
        (file: string) => {
          // Ensure the file is a valid string before updating state
          if (file) {
            setVideoUrl(file); // setUrl expects a string, ensure it's not undefined
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
        setLoading,
        dep
      );
    },
    []
  );

  return (
    <motion.div className=" bg-neutral-900 h-[75%] rounded-md p-3">
      {!addvideo ? (
        <div className="h-[380px]">
          <h6 className="text-neutral-300 text-xl underline underline-offset-1 text-center my-3">
            Adding Videos Guideline
          </h6>

          <span
            className="absolute top-2 right-4 text-[15px] font-bold"
            onClick={() => setShowVideo(false)}
          >
            &times;
          </span>
          <ul className="custom-list ml-4">
            <h6 className="text-neutral-400 ">
              By Adding videos to your profile you:
            </h6>
            <li className="text-neutral-500 ">
              You create a portfolio for future jobs
            </li>
            <li className="text-neutral-500">
              Depending on reviews this can make people see if reviews are true
              or not
            </li>
            <li className="text-neutral-500 ">
              you create a following of clients that like your work
            </li>
            <li className="text-neutral-500 ">
              You also allow clients to judge you by your work
            </li>
            <li className="text-neutral-500 ">
              It adds alot to your online presence
            </li>
          </ul>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-[100%] bg-neutral-400 bg-opacity-20"
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        >
          <form
            className="h-full z-[50] shadow-md shadow-slate-500 w-[90%] mx-auto  mt-2 p-4"
            onSubmit={handlePost}
          >
            <h6 className="text-[15px] text-red-100 underline text-center mb-3">
              Jam Details
            </h6>
            <div className="w-full -mt-1">
              {" "}
              <Input
                id="post"
                type="text"
                className=" mt-2 p-2 w-full text-[13px] bg-gray-300 rounded-md focus-within:ring-o outline-none"
                placeholder="Create a Jamtitle...."
                required
                name="title"
                value={videos?.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full mt-5">
              <input
                autoComplete="off"
                id="post"
                name="description"
                value={videos?.description}
                onChange={handleInputChange}
                type="text"
                placeholder="Jam session description......"
                required
                className="p-2 w-full text-[13px] bg-gray-300 rounded-md focus-within:ring-o outline-none"
              />
            </div>
            {user?.videos?.length < 4 && (
              <>
                {!videoUrl ? (
                  <div className="flex justify-between items-center w-full mx-auto mt-4">
                    {/* <VideoUploadWidget /> */}
                    <label
                      htmlFor="postvideo"
                      className="bg-neutral-400 flex justify-center title py-2 px-3 mt-2 min-w-[115px] rounded-xl whitespace-nowrap"
                    >
                      {!loading ? (
                        <p> Upload Video</p>
                      ) : (
                        <CircularProgress
                          size="13px"
                          sx={{ color: "white", fontBold: "500" }}
                          className="bg-orange-700 rounded-tr-full text-[15px] font-bold"
                        />
                      )}
                    </label>

                    <input
                      id="postvideo"
                      className="hidden"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />

                    <BsArrowLeftShort
                      className="  text-gray-600"
                      size="24px"
                      style={{ fontSize: "19px", color: "gray" }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setShowVideo(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[200px] md:h-[320px] bg-gray-800 mt-7">
                    <video
                      className="w-full h-[100%] object-cover"
                      src={fileUrl}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                )}
                <h6 className="my-5 text-[15px] text-orange-700 font-mono font-bold">
                  {videos.description.length > 0
                    ? `#${videos.description}`
                    : ""}
                </h6>
                {videoUrl && (
                  <div className="h-[30px] w-[100%] text-center">
                    <Button
                      disabled={isloading}
                      variant="secondary"
                      type="submit"
                      className="h-full w-[80%]   text-[15px]  p-4 !bg-amber-700 font-sans text-gray-200"
                    >
                      {!isloading ? (
                        "  Upload Video"
                      ) : (
                        <CircularProgress
                          size="13px"
                          sx={{ color: "white", fontBold: "500" }}
                          className="bg-orange-700 rounded-tr-full text-[15px] font-bold"
                        />
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </form>
        </motion.div>
      )}{" "}
      {!addvideo && (
        <div className="bg-amber-600 w-[80%] mx-auto my-5 rounded-sm py-2">
          <h6
            className="text-white text-1xl font-bold flex justify-center font-sans"
            onClick={(ev) => {
              ev.stopPropagation();
              setAddVideo(true);
            }}
          >
            Add Videos{" "}
          </h6>
        </div>
      )}
    </motion.div>
  );
};

export default Videos;
