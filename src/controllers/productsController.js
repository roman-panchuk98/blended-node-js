import createHttpError from 'http-errors';
import {
  createProductService,
  deleteProductByIdService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from '../services/product.js';

export const getProducts = async (req, res) => {
  const products = await getAllProductsService({ userId: req.user._id });
  res.status(200).json(products);
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await getProductByIdService({
    _id: productId,
    userId: req.user._id,
  });
  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};

export const createProduct = async (req, res) => {
  const product = await createProductService({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await updateProductService(
    { _id: productId, userId: req.user._id },
    req.body,
  );
  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await deleteProductByIdService({
    _id: productId,
    userId: req.user._id,
  });
  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};
