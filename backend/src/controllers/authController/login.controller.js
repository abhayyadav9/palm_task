import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User not found",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        status: false,
      });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET || "palm_task_secret_key",
      { expiresIn: "7d" }
    );

    const user = existingUser.toObject();
    delete user.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      status: true,
      token: token,
      data: user,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

export default login;