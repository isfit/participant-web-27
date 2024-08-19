import { Request, Response, NextFunction } from "express";
import User from '../models/User'; 
import { ROLES } from "../../config/roles";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ role: { $ne: ROLES.ADMIN } });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export { getAllUsers };