import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';
import { submitApplication, getApplications, downloadCertificate, getMyApplication } from '../controllers/application';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/apply', authenticate, upload.single('studentCertificate'), submitApplication);

router.get('/me', authenticate, getMyApplication);

router.get('/applications', authenticate, checkRole(ROLES.ADMIN), getApplications);

router.get('/certificate/:id', authenticate, checkRole(ROLES.ADMIN), downloadCertificate);

export default router