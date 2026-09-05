import { registerUser, loginUser, logoutUser, getCurrentUser} from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/me', getCurrentUser);

export default router;
