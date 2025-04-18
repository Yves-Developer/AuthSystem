import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export const jwtoken = (userEmail) => {
  const token = jwt.sign(
    {
      email: userEmail,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
