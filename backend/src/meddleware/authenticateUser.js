import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "unauthorized",
        status: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch {
    return res.status(500).json({
      message: "internal server error",
      status: false,
    });
  }
};

export default authenticateUser;
