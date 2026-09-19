import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../src/models/message.model.js";

const getToken = (cookieHeader) => {
  const token = cookieHeader?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  return token ? decodeURIComponent(token) : null;
};

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const getOnlineUserIds = () => Array.from(userSockets.keys());

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        getToken(socket.handshake.headers.cookie);

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "palm_task_secret_key"
      );
      socket.userId = decoded.id;
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log("User connected:", userId || socket.id);

    if (userId) {
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
      socket.join(`user:${userId}`);
      io.emit("get_online_users", getOnlineUserIds());
    }

    socket.on("join_user", (targetUserId) => {
      if (!targetUserId || String(targetUserId) !== String(socket.userId)) return;
      socket.join(`user:${targetUserId}`);
      if (!userSockets.has(targetUserId)) {
        userSockets.set(targetUserId, new Set());
      }
      userSockets.get(targetUserId).add(socket.id);
      io.emit("get_online_users", getOnlineUserIds());
    });

    socket.on("send_message", async (data, acknowledge) => {
      try {
        const receiver = data.receiverId ?? data.receiver;
        const content = data.content ?? data.message;
        const { clientMessageId } = data;

        if (!socket.userId) {
          acknowledge?.({ ok: false, error: "Please authenticate before sending messages" });
          return;
        }

        if (!receiver || !content?.trim()) {
          acknowledge?.({ ok: false, error: "Receiver and message content are required" });
          return;
        }

        const newMessage = await Message.create({
          sender: socket.userId,
          receiver,
          content: content.trim(),
        });

        const messageToSend = {
          ...newMessage.toObject(),
          clientMessageId,
        };

        io.to(`user:${receiver}`).emit("receive_message", messageToSend);
        io.to(`user:${socket.userId}`).emit("receive_message", messageToSend);

        acknowledge?.({ ok: true, data: messageToSend });
      } catch (error) {
        console.error("Socket message error:", error);
        acknowledge?.({ ok: false, error: "Unable to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId || socket.id);
      if (userId && userSockets.has(userId)) {
        const sockets = userSockets.get(userId);
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
        io.emit("get_online_users", getOnlineUserIds());
      }
    });
  });
};

export default socketServer;