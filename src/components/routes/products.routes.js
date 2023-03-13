import { Router } from 'express';
import upload from '../../libs/storage.js';
import {
  createNewProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
  getProductSearch,
} from '../controllers/products.controllers.js';

const router = Router();

router.post('/products', getProducts); // pagination service route
router.post('/product/search', getProductSearch);
router.get('/product/:id', getProductById);
router.post('/product/create', upload.single('imgUrl'), createNewProduct);
router.put('/product/:id', editProduct);
router.delete('/product/:id', deleteProduct);

export default router;
