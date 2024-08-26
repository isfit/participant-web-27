import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';
import { submitApplication, getApplications } from '../controllers/application';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/apply', authenticate, upload.single('studentCertificate'), submitApplication);

router.get('/applications', authenticate, checkRole(ROLES.ADMIN), getApplications);

export default router