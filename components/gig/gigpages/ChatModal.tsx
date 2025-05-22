import Chat from "@/components/chat/Chat";
import { UserProps } from "@/types/userinterfaces";
import { motion } from "framer-motion";
import { X } from "react-feather";

interface ModalProps {
  onOpenX: () => void;
  onClose: () => void;
  modal: {
    type: string;
    user: UserProps;
  };
  user: UserProps;
  className: string;
}

const ChatModal: React.FC<ModalProps> = ({
  onClose,
  modal,
  user,
  onOpenX,
  className,
}) => (
  <div className={`${className} transition-colors duration-300`}>
    {" "}
    {/* Backdrop with opacity */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    />
    {/* Modal content */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-lg p-6 shadow-lg max-w-md w-full text-white bg-gray-800 border border-gray-700 z-10 max-h-[90vh] overflow-y-auto"
    >
      <div className="h-full">
        <h2 className="text-xl font-bold mb-4">
          {modal.type === "chat" && (
            <Chat
              onClose={onClose}
              modal={modal}
              myuser={user}
              onOpenX={onOpenX}
            />
          )}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-200 hover:text-white transition-all p-1 rounded-full hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  </div>
);

export default ChatModal;
