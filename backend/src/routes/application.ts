import express from 'express';
import authenticate from '../middleware/auth';
import checkRole from '../middleware/checkRole';
import { ROLES } from '../../config/roles';
import submitApplication from '../controllers/application';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/apply', authenticate, upload.single('studentCertificate'), submitApplication);



router.get("/refresh")

router.get("/logout")

export default router