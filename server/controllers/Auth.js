import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../lib/email/mailtrap.js"; // To generate unique tokens
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Assuming you have a User model
import { jwtoken } from "../utils/jwtoken.js";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
};

// Signup controller to create user and send verification email
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password before storing (security best practice)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Create a new user (you might store the verification code in the database)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false, // User is not verified initially
    });

    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationCode);
    const token = jwtoken(user.email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(201).json({
      message:
        "User created. Please check your email for the verification code.",
      sentData: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//Login controller

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    //3. generate and set jwtoken in cookie
    const token = jwtoken(user.email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    // 4. Send response
    res.status(200).json({
      message: "User logged in.",
      sentData: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//log out
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

// Controller to verify email using the verification code
export const verifyEmail = async (req, res) => {
  const { code } = req.params;
  const { email } = req.query.email;
  try {
    // Find the user by the verification code
    const user = await User.findOne({ verificationCode: code, email });
    // If no user found, or the code is invalid
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    // // Verify the user's email
    user.isVerified = true;
    delete user.verificationCode; // Once verified, clear the verification code field

    await user.save(); // Save the updated user

    res.status(200).json({
      message: "Email verified successfully!",
      sentData: {
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during email verification." });
  }
};

// Controller to check if a user is verified
export const checkUserVerification = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "User is verified." });
    } else {
      return res.status(400).json({ message: "User is not verified." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Controller to send reset password by sending a reset link with reset token
export const sendResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Here you would generate a password reset token and send it via email
    const resetToken = uuidv4(); // Example token generation
    user.resetToken = resetToken; // Store the token in the user model
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save(); // Save the updated user
    await sendPasswordResetEmail(email, resetToken); // Send the password reset email
    res.status(200).json({ message: `Password reset link sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
// controll to actually reset password after verifying tokens
export const resetPassword = async (req, res) => {
  //1. Get request body paload
  const { email, token, newpassword } = req.body;
  //2. check user by email and verify reset token and expiry date
  const user = await User.findOne({
    email,
    resetToken: token,
    resetTokenExpiration: {
      $gte: new Date(),
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired Token!" });
  }
  //3.harsh new password
  const harshPassword = await bcrypt.hash(newpassword, 10);
  //4. Update password in db
  user.password = harshPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  //5. return json response
  return res.status(200).json({ message: "Password reset successfully!" });
};
// get user details
export const getUser = async (req, res) => {
  const email = req.email.email;
  console.log(email);
  if (!email) {
    return res.status(404).json({ message: "Email not found!" });
  }
  try {
    const user = await User.findOne({ email, isVerified: true }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User Found!", sentData: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// check user logged In
export const checkUserLoggedIn = (req, res) => {
  if (!req.email.email) {
    return res.status(400).json({ message: "User Not Athenticated!" });
  }
  return res
    .status(200)
    .json({ message: "User Athenticated!", email: req.email.email });
};
