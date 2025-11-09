import { Router } from 'express';
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
} from '../controllers/productsController.js';

const router = Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.post('/products', createProduct);
router.patch('/products/:productId', updateProduct);
export default router;
