"use client";
import { fileupload } from "@/hooks/fileUpload";
import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import React, { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";

interface VideoComponentProfileProps {
  user: UserProps;
  setVideoUrl: (videoUrl: string) => void;
  videos: VideoProfileProps[];
  upload: boolean;
  videoUrl: string | null;
  showUpload: (upload: boolean) => void;
}

const VideoProfileComponent = ({
  user,
  setVideoUrl,
  upload,
  showUpload,
}: VideoComponentProfileProps) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [addedVideos, setAddedVideos] = useState<string[]>([]);

  console.log(user?.videosProfile);
  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (addedVideos.includes(fileUrl)) return;
      fileupload(
        event,
        (file: string) => {
          if (file) {
            setVideoUrl(file);
            setAddedVideos((prev) =>
              prev.length < 3 ? [...prev, file] : prev
            );
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
        setUploading,
        dep,
        user
      );
    },
    [fileUrl, addedVideos]
  );

  return (
    <>
      {upload && (
        <div className="flex justify-center items-center fixed inset-0 z-50 bg-black/40">
          <div className="relative w-[80%] mx-auto max-w-2xl bg-neutral-700 rounded-lg p-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => showUpload(false)}
              className="absolute right-4 top-4 text-white text-2xl font-bold hover:text-gray-300"
            >
              &times;
            </button>

            <h2 className="text-center text-white text-xl font-semibold mb-4">
              Upload Your Video
            </h2>

            {user?.videosProfile?.length < 3 || addedVideos.length < 3 ? (
              <div className="flex flex-col items-center gap-4">
                {addedVideos.length < 4 && (
                  <>
                    <label
                      htmlFor="postvideo"
                      className={
                        !uploading
                          ? "bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-lg cursor-pointer transition"
                          : "pointer-events-none"
                      }
                    >
                      {!uploading ? (
                        "Upload Video"
                      ) : (
                        <CircularProgress
                          size="16px"
                          style={{ color: "white" }}
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
                  </>
                )}
              </div>
            ) : (
              <p className="text-neutral-400 text-center">
                {`You've reached the maximum number of clips (3). Delete one to
                upload another.`}
              </p>
            )}

            {/* Display Added Videos */}
            {addedVideos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white text-md font-semibold mb-2">
                  Recently Added Videos
                </h3>
                <div className="flex gap-3 overflow-x-auto">
                  {addedVideos.map((vid, index) => (
                    <div
                      key={index}
                      className="relative group w-24 h-24 rounded-lg overflow-hidden border"
                    >
                      <video
                        className="w-full h-full object-cover"
                        src={vid}
                        muted
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Permanent Videos */}
            {user?.videosProfile?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Your Videos
                </h3>
                <div className="flex gap-3 overflow-x-auto">
                  {user?.videosProfile.map((vid) => (
                    <div
                      key={vid._id}
                      className="relative group w-24 h-24 rounded-lg overflow-hidden border"
                    >
                      <video
                        className="w-full h-full object-cover"
                        src={vid.url}
                        muted
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VideoProfileComponent;
