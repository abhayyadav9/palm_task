import Message from "../../models/message.model.js";

const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.query;

    if (!receiverId) {
      return res.status(400).json({
        status: false,
        error: "Receiver ID is required",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      status: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      status: false,
      error: "Failed to fetch messages",
    });
  }
};

export default getMessages;