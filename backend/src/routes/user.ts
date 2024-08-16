import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.body.user.firstName} ${req.body.user.lastName}` })
});


router.get('/adminPage', authenticate, checkRole(ROLES.ADMIN), (req, res) => {
    res.json({ message: 'Welcome ' + req.body.user.firstName + ' ' + req.body.user.lastName + ' to the admin page' });
});

router.get("/refresh")

router.get("/logout")

export default router