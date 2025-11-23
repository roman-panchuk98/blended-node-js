import { Router } from 'express';
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProductById,
} from '../controllers/productsController.js';

const router = Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.post('/products', createProduct);

router.patch('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProductById);
export default router;
