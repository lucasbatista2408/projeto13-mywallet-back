import express from 'express';
import { LogIn, SignUp } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', LogIn)

export default router;