import mongoose from "mongoose";
import User from "../modals/users.modals.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";
import transporter from "../config/nodemiler.js";
import {emailTemplate, tokenVerificationTemplate} from "../utils/email-template.js";

const FRONTEND_URL = "https://golobal-travels.vercel.app/";

const generateVerificationToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";

    for (let index = 0; index < 4; index += 1) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    return token;
};

const sendVerificationEmail = async (email, name, verificationToken) => {
    const verificationUrl = `${FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`;

    const message = tokenVerificationTemplate(name, verificationUrl, verificationToken)

    await transporter.sendMail({
        from: `"Travels API" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html:message,
    });
};

const sendPasswordResetEmail = async (email, name, resetToken) => {
    const resetUrl = `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    const message = emailTemplate(name, resetUrl)

    await transporter.sendMail({
        from: `"Travels API" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: message
    })
}

const getCookieOptions = () => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.status = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt,
        }], { session });
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        await session.endSession();

        res.cookie("token", token, getCookieOptions());
        await sendVerificationEmail(newUser[0].email, newUser[0].name, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully. Verification code sent to email.",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
};

export const reSendEmailVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        if (user.isVerified) {
            const error = new Error("Email is already verified");
            error.status = 400;
            throw error;
        }

        const verificationToken = generateVerificationToken();
        const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = verificationTokenExpiresAt;
        await user.save();

        await sendVerificationEmail(user.email, user.name, verificationToken);

        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { email, token } = req.body;
        const normalizedToken = String(token || "").trim().toUpperCase();

        const user = await User.findOne({
            email,
            verificationToken: normalizedToken,
            verificationTokenExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            const error = new Error("Invalid or expired verification token");
            error.status = 400;
            throw error;
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("invalid credentials");
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 400;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie("token", token, getCookieOptions());

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("token", getCookieOptions());

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const resetPasswordToken = generateVerificationToken();
        const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, user.name, resetPasswordToken)
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });

    }catch (error) {
        next(error)
    }
};

export const recoverPassword = async (req, res, next) => {
    try {
        const { email, token, password } = req.body;
        const normalizedToken = String(token || "").trim().toUpperCase();

        const user = await User.findOne({
            email,
            resetPasswordToken: normalizedToken,
            resetPasswordExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            const error = new Error("Invalid or expired reset token");
            error.status = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req,res, next) => {
    try {
        const userId = req.user._id
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
           const error = new Error("current password and newPassword is required");
           error.status = 400;
           throw error;
        }
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            const error = new Error("Invalid current password");
            error.status = 400;
            throw error;
        }

        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
            const error = new Error("New password cannot be the same as the current password");
            error.status = 400;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    }catch (error) {
        next(error)
    }
}
