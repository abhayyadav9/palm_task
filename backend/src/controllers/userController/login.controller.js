import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  console.log("login controller called");

  try {
    const { email, password } = req.body;

    console.log("email,password", email, password);

    if (!email || !password) {
      return res.status(400).json({
        message: "all field are required",
        status: false,
      });
    }

    const eistingUser = await User.findOne({ email });

    if (!eistingUser) {
      return res.status(400).json({
        message: "user not found",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      eistingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalid password",
        status: false,
      });
    }

    const token = jwt.sign(
      { id: eistingUser._id },process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    // remove password before sending response
    eistingUser.password = undefined;

    // save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "login successful",
      status: true,
      token: token,
      data: eistingUser,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "internal server error",
      status: false,
    });
  }
};

export default login;