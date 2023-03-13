import { Router } from 'express';
import { getCart } from '../controllers/cart.controllers.js';
import auth from '../../middlewares/auth.js';

const cartRoutes = Router();

cartRoutes.get('/cart', auth, getCart);

export default cartRoutes;
