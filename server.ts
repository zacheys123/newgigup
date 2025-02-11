import next from "next";
import express, { Express } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = 3000;

const app: Express = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("join_chat", (chatId: string) => {
    socket.join(chatId);
    console.log(`✅ User joined chat: ${chatId}`);
  });

  socket.on("send_message", (message) => {
    console.log("📩 New message:", message);
    io.to(message.chatId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use(cors());
app.all("*", (req, res) => handle(req, res));

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
