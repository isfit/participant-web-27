import { type Request, type Response, Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import { register, login, refresh, generateResetLink, resetPassword } from '../controllers/auth'
import authenticate from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { ROLES } from '../../config/roles'

export

    const router = Router()


router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/generate-reset-link', authenticate, checkRole(ROLES.ADMIN), generateResetLink)
router.post('/reset-password', resetPassword)


export default router