import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    
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
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "Account created succressfully",
    });
  } catch (err) {
    console.error("Register eror:", err);

    return res.status(500).json({
      status: false,
      message: "internal server error",
    });
  }
};

export default register;