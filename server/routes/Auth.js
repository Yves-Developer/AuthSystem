import express from "express";
import {
  signup,
  verifyEmail,
  resetPassword,
  checkUserVerification,
  getUser,
  login,
  logout,
  checkUserLoggedIn,
  sendResetPassword,
} from "../controllers/Auth.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:code/:email", protect, verifyEmail);
router.post("/send-reset-password", sendResetPassword);
router.post("/reset-password", resetPassword);
router.post("/check-user-verification", protect, checkUserVerification);
router.get("/check-user-loggedin", protect, checkUserLoggedIn);
router.get("/user", protect, getUser);
router.get("/logout", logout);
export default router;
