import {Router} from 'express';
import {
    recoverPassword,
    reSendEmailVerification,
    signIn,
    signOut,
    signUp,
    verifyEmail,
    forgotPassword, changePassword
} from '../controllers/auth.controllers.js';
import authorise from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post('/register', signUp);
authRoutes.post('/verify-email', verifyEmail);
authRoutes.post('/resend-verification-token', reSendEmailVerification);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/recover-password', recoverPassword);
authRoutes.put('/change-password', authorise, changePassword)
authRoutes.put('/login', signIn);
authRoutes.post('/logout', signOut);

export default authRoutes;
