import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const phone = req.body.phone?.trim();
    const { password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "Account created successfully",
    });
  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export default register;