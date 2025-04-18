import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded;
    console.log("Email:", decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
