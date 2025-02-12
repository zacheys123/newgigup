import { useSocket } from "@/app/Context/SocketContext";

const useSocketData = () => {
  const socket = useSocket();

  return socket;
};

export default useSocketData;
