import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import {
  getAllUsers,
  getUserById,
  logoutAllUsers,
  logoutUser,
  singInUser,
  singUpUser,
} from '../controllers/user.controllers.js';

const userRouter = Router();

userRouter.post('/users', singUpUser); // pagination service route
userRouter.post('/users/login', singInUser);
userRouter.get('/users/logout', auth, logoutUser);
userRouter.post('/users/logoutAll', auth, logoutAllUsers);
userRouter.post('/users/getUserById', getUserById);
userRouter.post('/users/getAllUsers', getAllUsers);

export default userRouter;
