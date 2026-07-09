import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import exp from "constants";
import { body, validationResult } from "express-validator";
import { ROLES } from "../../config/roles";
import crypto from "crypto";

// Register
const register = [
    //Validation
    body("fullName")
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name is invalid"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isString()
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters long"),
    body("role")
        .isString()
        .isIn([ROLES.ADMIN, ROLES.USER])
        .withMessage("Role is invalid"),

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { fullName, email, password } = req.body;
        try {
            const user = new User({
                fullName,
                email,
                password,
            });
            await user.save();
            res.status(201).json({ message: "User created" });
        } catch (error) {
            next(error);
        }
    },
];

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const payload = {
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "60m",
        });

        const refreshToken = jwt.sign(
            { email: email, role: role },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies.token) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const refreshToken = cookies.token;

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as { email: string };
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const token = jwt.sign(
            { email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "60m" }
        );

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

// Generate reset link (admin-only) - admin sends this link to the user manually
const generateResetLink = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save hashed token and expiration to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        res.status(200).json({ resetLink });
    } catch (error) {
        next(error);
    }
};

// Reset Password - Verify token and update password
const resetPassword = [
    body("token").isString().withMessage("Token is required"),
    body("newPassword")
        .isString()
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters long"),

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;
        try {
            // Hash the token to compare with stored one
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            // Find user with valid token
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: new Date() },
            });

            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            // Update password
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            next(error);
        }
    },
];

export { register, login, refresh, generateResetLink, resetPassword };

const auth = {};
