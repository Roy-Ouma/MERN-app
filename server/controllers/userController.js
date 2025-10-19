import User from "../models/UserModel.js";
import Verification from "../models/emailVerification.js";
import { compareString, createJWT } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import Follower from "../models/followerModel.js";

export const OTPVerification = async (req, res, next) => {
  try {
    const { userId, otp } = req.params;
    const result = await Verification.findOne({ userId });

    if (!result) {
      return res.status(404).json({ message: "Verification record not found" });
    }

    const { expiresAt, token } = result;

    if (expiresAt < Date.now()) {
      await Verification.findOneAndDelete({ userId });
      return res.status(410).json({ message: "Code has expired. Please request again" });
    }

    const isMatch = await compareString(otp, token);
    if (isMatch) {
      await Promise.all([
        User.findByIdAndUpdate(userId, { emailVerified: true }),
        Verification.findOneAndDelete({ userId }),
      ]);

      return res.status(200).json({ message: "Email verified successfully. You can now login" });
    }

    return res.status(400).json({ message: "Invalid OTP, please try again" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Verification.findOneAndDelete({ userId: id });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = undefined;
    const token = createJWT(user._id);

    if (user?.accountType === "Writer") {
      await sendVerificationEmail(user, req, res, token);
      return; // sendVerificationEmail handles the response in your utils
    }

    return res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const followWriter = async (req, res, next) => {
  try {
    const followerId = req.body.user?.userId || req.body.userId;
    const { id } = req.params; // writer id

    if (!followerId) {
      return res.status(400).json({ success: false, message: "Missing follower id" });
    }

    const exists = await Follower.findOne({ followerId, userId: id });
    if (exists) {
      return res.status(200).json({ success: false, message: "You are already following this writer" });
    }

    const writer = await User.findById(id);
    if (!writer) return res.status(404).json({ success: false, message: "Writer not found" });

    const newFollower = await Follower.create({ followerId, userId: id });
    writer.followers = writer.followers ? [...writer.followers, newFollower._id] : [newFollower._id];
    await writer.save();

    return res.status(201).json({
      success: true,
      message: `You are now following this writer ${writer?.name}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, image } = req.body;

    if (!firstName || !lastName) {
      next(new Error("Please provide all required fields"));
      return;
    }

    const userId = req.body.user || req.body.userId;
    const updateUser = {
      name: firstName + " " + lastName,
      image,
    };

    const user = await User.findByIdAndUpdate(userId, updateUser, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = createJWT(user._id);
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getWriter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({ path: "followers", select: "followerId" });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = undefined;
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await User.findById(id).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.json({ success: true, user });
    }
    const users = await User.find().select("-password");
    return res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};



