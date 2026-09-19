import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        status: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "palm_task_secret_key");
    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
      status: false,
    });
  }
};

export default authenticateUser;

