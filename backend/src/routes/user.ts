import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';
import { getAllUsers } from '../controllers/users';

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.body.user.firstName} ${req.body.user.lastName}` })
});


router.get('/adminPage', authenticate, checkRole(ROLES.ADMIN), (req, res) => {
    res.json({ message: 'Welcome ' + req.body.user.firstName + ' ' + req.body.user.lastName + ' to the admin page' });
});

router.get('/users', authenticate, checkRole(ROLES.ADMIN), getAllUsers);

export default router