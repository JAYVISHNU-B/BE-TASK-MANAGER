import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword} from '../controllers/acontroller.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:userId/:token', resetPassword);

export default router;
