import User from "../../models/user.model.js";

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      status: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to delete user",
    });
  }
};

export default deleteUser;