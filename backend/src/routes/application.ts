import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';
import { submitApplication, getApplications, downloadCertificate } from '../controllers/application';
import multer from 'multer';

const router = express.Router();

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route for submitting an application with file upload for studentCertificate
router.post('/apply', authenticate, upload.single('studentCertificate'), submitApplication);

// Route for getting applications with pagination and date filtering, accessible only by admin
router.get('/applications', authenticate, checkRole(ROLES.ADMIN), getApplications);

// Route for downloading student certificate by application ID, accessible only by admin
router.get('/certificate/:id', authenticate, checkRole(ROLES.ADMIN), downloadCertificate);

export default router;
