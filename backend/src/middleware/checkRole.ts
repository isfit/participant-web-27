import { Request, Response, NextFunction } from 'express';

const checkRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.body.user?.role;
        
        if (!role.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
        }

        next();
    };
};

export default checkRole;