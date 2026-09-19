import User from "../../models/user.model.js";

const updateUser = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name?.trim()) updates.name = req.body.name.trim();
    if (req.body.phone?.trim()) updates.phone = req.body.phone.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields to update",
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update user",
    });
  }
};

export default updateUser;