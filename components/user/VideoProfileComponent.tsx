"use client";
import { fileupload } from "@/hooks/fileUpload";
import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import React, { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";
// import { Input } from "../ui/input";

interface VideoComponentProfileProps {
  user: UserProps;
  setVideoUrl: (videoUrl: string) => void;
  videos: VideoProfileProps[];
  videoUrl: string | null;
  upload: boolean;
  showUpload: (upload: boolean) => void;
}

const VideoProfileComponent = ({
  user,
  setVideoUrl,
  videoUrl,
  videos,
  upload,
  showUpload,
}: VideoComponentProfileProps) => {
  //   const [video, setVideo] = useState<VideoProfileProps>({
  //     title: "",
  //     url: "",
  //     _id: "",
  //   });
  const [fileUrl, setFileUrl] = useState<string>("");
  //   const { setShowUpload, showUpload } = useStore();
  const [uploading, setUpLoading] = useState<boolean>(false);
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      fileupload(
        event,
        (file: string) => {
          if (file) {
            setVideoUrl(file);
          }
        },
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => {
          if (file) {
            setFileUrl(file);
          }
        },
        setUpLoading,
        dep
      );
    },
    [fileUrl]
  );
  //   const handleInputChange = (
  //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setVideo((prev) => ({ ...prev, [name]: value }));
  //   };

  return (
    <div className="flex justify-center items-center absolute z-50 h-[90%] w-[100%] mx-auto">
      {upload && (
        <span
          onClick={() => showUpload(!upload)}
          className="absolute right-1 -top-8 font-bold text-white z-50 text-[30px] cursor-pointer"
        >
          &times;
        </span>
      )}
      {upload && (
        <div className="absolute h-full w-[95%] mx-auto bg-neutral-600 p-4 overflow-auto">
          {user?.videosProfile?.length < 4 || videos?.length < 4 ? (
            <>
              {!videoUrl ? (
                <div className="flex justify-between items-center w-full mx-auto mt-4">
                  <label
                    htmlFor="postvideo"
                    className="bg-neutral-400 flex justify-center title py-2 px-3 mt-2 min-w-[115px] rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    {!uploading ? (
                      <p>Upload Video</p>
                    ) : (
                      <CircularProgress
                        size="13px"
                        sx={{ color: "white", fontWeight: "500" }}
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
                    disabled={uploading}
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
            </>
          ) : (
            <div className="flex flex-col gap-2 my-3 p-2">
              <span className="text-neutral-400 mb-1 text-center">
                {`You've reached the maximum number of clips to upload, delete/remove one to upload another`}
              </span>
            </div>
          )}
          <div className="">
            {videos?.map((vid: VideoProfileProps) => (
              <div className="flex gap-2" key={vid?._id}>
                <div className="w-[100px] h-[100px] overflow-hidden rounded-full border-2 border-gray-600">
                  <img
                    className="object-cover w-full h-full"
                    src={vid?.url}
                    alt="User Avatar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-sm">{`Clip ${
                    videos.indexOf(vid) + 1
                  }`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProfileComponent;
