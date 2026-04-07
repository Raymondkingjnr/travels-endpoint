import {Router} from 'express';
import {getAllUsers, getUser} from "../controllers/users.contollers.js";
import authorise from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getAllUsers)
userRouter.get('/:id', authorise, getUser)
userRouter.post('/edit/:id', authorise, (req, res) => res.send(req.body))

export default userRouter;