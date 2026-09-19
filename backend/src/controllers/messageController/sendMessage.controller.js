import Message from "../../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({
        status: false,
        error: "Receiver ID and content are required",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim(),
    });

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      status: false,
      error: "Failed to send message",
    });
  }
};

export default sendMessage;