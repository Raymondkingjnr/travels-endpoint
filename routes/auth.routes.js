import {Router} from 'express';
import {signIn, signOut, signUp} from '../controllers/auth.controllers.js';

const authRoutes = Router();

authRoutes.post('/register', signUp);
authRoutes.post('/login', signIn);
authRoutes.post('/logout', signOut);

export default authRoutes;
