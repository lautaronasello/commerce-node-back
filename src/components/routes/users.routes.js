import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import {
  logoutAllUsers,
  logoutUser,
  singInUser,
  singUpUser,
} from '../controllers/user.controllers.js';

const userRouter = Router();

userRouter.post('/users', singUpUser); // pagination service route
userRouter.post('/users/login', singInUser);
userRouter.post('users/logout', auth, logoutUser);
userRouter.post('users/logoutAll', auth, logoutAllUsers);

// userRouter.get('/users/:id', getUserById);

export default userRouter;
