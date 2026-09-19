import User from "../../models/user.model.js";
import Message from "../../models/message.model.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      status: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100
    );
    const query = req.query.query?.trim();
    const filter = { _id: { $ne: currentUserId } };

    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQuery, "i");

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers, totalSystemUsers, totalMessages, chatPairs] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
      User.countDocuments(),
      Message.countDocuments(),
      Message.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                { $lt: ["$sender", "$receiver"] },
                { u1: "$sender", u2: "$receiver" },
                { u1: "$receiver", u2: "$sender" },
              ],
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      message: "Users fetched successfully",
      status: true,
      data: users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      stats: {
        totalUsers: totalSystemUsers,
        totalMessages,
        totalChats: chatPairs.length,
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

export default getAllUsers;

