// import { io, Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter"; // Ensure correct types

// const SOCKET_URL = "http://localhost:3000"; // Update for production

// let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

// export const connectSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
//   if (!socket) {
//     socket = io(SOCKET_URL, { transports: ["websocket"] });

//     socket.on("connect", () => {
//       console.log("🟢 Connected to Socket.io:", socket?.id);
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 Disconnected from Socket.io");
//       socket = undefined; // Reset on disconnect for proper reconnection
//     });
//   }

//   return socket as Socket<DefaultEventsMap, DefaultEventsMap>; // Type assertion ensures it's never undefined
// };

// export default connectSocket;
