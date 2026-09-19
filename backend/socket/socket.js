import { Server } from "socket.io";
import Message from "../src/models/message.model.js";

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_user", (userId) => {
      socket.join(`user:${userId}`);
      socket.userId = userId;

      console.log("User joined:", userId);
    });

    socket.on("send_message", async (data, acknowledge) => {
      try {
        const receiver = data.receiverId ?? data.receiver;
        const content = data.content ?? data.message;
        const { clientMessageId } = data;

        if (!socket.userId) {
          acknowledge?.({ ok: false, error: "Join a user before sending messages" });
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
        console.log("Message error:", error);
        acknowledge?.({ ok: false, error: "Unable to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketServer;