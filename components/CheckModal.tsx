import { UserProps } from "@/types/userinterfaces";
import { motion } from "framer-motion";
import Chat from "./chat/Chat";

interface ModalProps {
  onOpenX: () => void;
  onClose: () => void;
  modal: {
    type: string;
    user: UserProps;
  };
  user: UserProps;
}

const CheckModal: React.FC<ModalProps> = ({
  onClose,
  modal,
  user,
  onOpenX,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 overflow-y-auto top-1/4"
  >
    {/* Background overlay */}
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-[12px]" />

    {/* Full-height modal container */}
    <div className="flex items-start justify-center min-h-screen pt-4 pb-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-neutral-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[calc(100vh-2rem)] my-4 flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-gray-200 hover:text-white transition-all p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
        >
          ✕
        </button>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          {modal.type === "chat" && (
            <Chat
              onClose={onClose}
              modal={modal}
              myuser={user}
              onOpenX={onOpenX}
            />
          )}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default CheckModal;
