import Verification from "../models/VerificationModel.js";
import { generateOTP, hashString } from "./index.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const {AUTH_EMAIL, AUTH_PASSWORD} = process.env;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,
    },
});

export const sendVerificationEmail = async (user, req, res, token) => {
    try {
        const { _id, email, name } = user;
        const otp = generateOTP(); 

        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject: "Email Verification - Maseno Radio",
            html: `
              <div style="font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p>Hi ${name},</p>
                <p>Thank you for registering on our platform. Please use the following One-Time Password (OTP) to verify your email address:</p>
                <h2>${otp}</h2>
                <p>This OTP is valid for 30 minutes. If you did not request this, please ignore this email.</p>
                <p>Best regards,<br/>Maseno Radio Team</p>
              </div>
            `
        };
        
        // create hashed token and verification record, then send email
        const hashedToken = await hashString(String(otp));

        const newVerifiedEmail = await Verification.create ({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * (60 * 1000), //30 minutes
        });

        if (newVerifiedEmail) {
            await transporter.sendMail(mailOptions);
            return res.status(201).send({
                success: "PENDING",
                message: "OTP has been sent to your email, please verify",
                user,
                token,
            });
        } else {
            return res.status(500).json({ error: "Verification record creation failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Email sending failed", message: error.message });
    }
};



        
      