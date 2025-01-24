import { motion } from "framer-motion";
import { ArrowBigLeftIcon } from "lucide-react"; // Replace with your icon library
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import { CircularProgress } from "@mui/material";

const VideoComponent = ({
  friendvideos,
  setCurrentVideo,
  setVideoActions,
  currentVideo,
  videoactions,
  setEditVideo,
  handleEdit,
  deleteVideo,
  editloading,
  setTitle,
  setDescription,
  title,
  description,
  editVideo,
  currentV,
  router,
  user,
  userid,
}: Props) => {
  return (
    <div className="overflow-y-auto h-screen w-full mx-auto shadow-lg shadow-orange-400 flex flex-col gap-4 bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="h-[50px] bg-inherit w-full flex items-center justify-between px-6 shadow-md">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400 transition duration-200"
          size={28}
          onClick={() => router.back()}
        />
        <h1 className="text-white text-3xl font-extrabold">All My Videos</h1>
      </div>
      {!friendvideos && (
        <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-md shadow-slate-500 py-8 px-6 text-center">
          <p className="text-neutral-400 text-lg">
            No videos available for this user.
          </p>
        </div>
      )}
      {friendvideos &&
        friendvideos.map((video: VideoProps) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-4 bg-zinc-900 rounded-lg shadow-md shadow-slate-600 py-6 px-4 hover:shadow-lg hover:scale-[1.02] transition-transform"
            onClick={(ev) => {
              setCurrentVideo(null);
              setVideoActions(false);
              ev.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-200">
                <span className="text-amber-400 font-bold">Gig Title:</span>{" "}
                {video.title}
              </h3>
              {user?._id === userid && (
                <BsThreeDotsVertical
                  className="cursor-pointer hover:text-amber-500 text-neutral-400 transition-transform transform hover:scale-110"
                  size={22}
                  onClick={(ev) => {
                    setCurrentVideo(video._id);
                    setVideoActions(true);
                    ev.stopPropagation();
                  }}
                />
              )}
            </div>
            {currentVideo === video._id && videoactions && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute right-0 bg-white shadow-2xl rounded-lg p-4 w-[280px] z-50"
              >
                <ul className="space-y-2">
                  <li
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2"
                    onClick={() => {
                      setEditVideo(true);
                      setCurrentVideo(video._id);
                    }}
                  >
                    ✏️ Edit Video
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2">
                    🌍 Share Publicly
                  </li>
                  <li
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 cursor-pointer transition-transform transform hover:translate-x-2"
                    onClick={() => deleteVideo(video._id)}
                  >
                    🗑️ Delete Video
                  </li>
                </ul>
              </motion.div>
            )}
            <div className="relative flex justify-end">
              {currentV === video?._id && editVideo && (
                <motion.div
                  initial={{ opacity: 0, transform: "translate(50px, -70px)" }}
                  animate={{ opacity: 1, transform: "translate(0px, 0px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute bg-white shadow-lg rounded-lg w-full max-w-[320px] p-6 border border-gray-200 sm:max-w-[340px] z-50"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center sm:text-left">
                    Edit Video
                  </h3>
                  <form
                    onSubmit={(ev) => handleEdit(ev, video)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={title ? title : video?.title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 p-2 text-sm border rounded-md shadow-sm border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter video title"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={description ? description : video?.description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full mt-1 p-2 text-sm border rounded-md shadow-sm border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter video description"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Cancel Button */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          setCurrentVideo(null);
                          setVideoActions(false);
                          ev.stopPropagation();
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md shadow hover:bg-gray-200 focus:ring focus:ring-gray-300 focus:outline-none"
                      >
                        Cancel
                      </button>

                      {/* Save Button */}
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md shadow hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
                      >
                        {!editloading ? (
                          "Save Changes"
                        ) : (
                          <CircularProgress
                            size={18}
                            style={{ color: "white" }}
                          />
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
            <video
              controls
              className="w-full h-auto rounded-lg shadow-md"
              src={video.source}
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-amber-500">{video.description}</p>
            <h5 className="text-neutral-400 text-sm">
              Posted on{" "}
              {moment(video.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </h5>
          </motion.div>
        ))}
    </div>
  );
};

export default VideoComponent;
