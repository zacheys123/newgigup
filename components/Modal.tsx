import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import { motion } from "framer-motion";
import Chat from "./chat/Chat";

interface ModalProps {
  onClose: () => void;
  modal: {
    type: string;
    user: UserProps;
  };
  user: UserProps;
}

const Modal: React.FC<ModalProps> = ({ onClose, modal, user }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full text-white relative h-[80%]"
  >
    <h2 className="text-xl font-bold mb-4">
      {modal.type === "chat" ? (
        <Chat onClose={onClose} modal={modal} myuser={user} />
      ) : (
        <section className="h-[500px] w-full">
          {modal?.user?.videosProfile?.length > 0 && (
            <header className="my-3">{`${modal?.user?.firstname}'s Videos`}</header>
          )}
          {modal?.user?.videosProfile.length > 0 ? (
            <div className="overflow-y-scroll h-full">
              {modal?.user?.videosProfile.map((video: VideoProfileProps) => (
                <video
                  src={video?.url}
                  key={video?._id}
                  controls
                  className="w-full h-full object-cover my-3 shadow-md shadow-yellow-800"
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              {modal?.user?.videosProfile?.length === 0
                ? "No videos found"
                : ""}
            </p>
          )}
        </section>
      )}
    </h2>

    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-400 hover:text-white transition-all"
    >
      ✕
    </button>
  </motion.div>
);

export default Modal;
