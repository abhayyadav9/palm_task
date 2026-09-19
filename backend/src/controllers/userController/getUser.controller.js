import User from "../../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
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
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "users fetched successfully",
      status: true,
      data: users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "internal server error",
      status: false,
    });
  }
};

export default getAllUsers;
