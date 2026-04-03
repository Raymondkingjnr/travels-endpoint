import {Router} from 'express';

const userRouter = Router();

userRouter.get('/', (res, req) => res.send({ message: 'users', body: req.body}))
userRouter.get('/:id', (res, req) => res.send({ message: 'user by id', body: req.body}))

export default userRouter;