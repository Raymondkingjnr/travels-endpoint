import {Router} from 'express';
import {getAllUsers, getUser} from "../controllers/users.contollers.js";
import authorise from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getAllUsers)
userRouter.get('/:id', authorise, getUser)

export default userRouter;