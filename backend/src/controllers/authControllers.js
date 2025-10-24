import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/mail.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;
    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({ message: "Email already exist !" });
    }

    const findByUserName = await User.findOne({ userName });
    if (findByUserName) {
      return res.status(400).json({ message: "Username already exist !" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 năm
      secure: false,
      sameSite: "Strict",
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error call singUp", error);
    res.status(500).json({ message: "Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { password, userName } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error call singIn", error);
    res.status(500).json({ message: "Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Sign out error: ${error}` });
  }
};


// 1) Gửi OTP vào email (Step 1)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email does not exist!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpireTime = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendMail(email, otp);
    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
// 2) Xác minh OTP (Step 2)
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp)
      return res.status(400).json({ message: "OTP is incorrect!" });

    if (user.otpExpireTime < Date.now())
      return res.status(400).json({ message: "OTP has expired!" });

    res.json({ message: "OTP chính xác!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3) Đổi mật khẩu mới (Step 3)
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email does not exist!" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOtp = null;
    user.otpExpireTime = null;
    await user.save();
    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};