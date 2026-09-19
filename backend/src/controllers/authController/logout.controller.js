const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
      status: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

export default logoutUser;