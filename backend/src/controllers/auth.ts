import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import exp from "constants";
import { body, validationResult } from "express-validator";
import { ROLES } from "../../config/roles";

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

export { register, login, refresh };

const auth = {};
