import { Product } from '../models/product.js';

export const getAllProductsService = async (id) => {
  return await Product.find(id);
};

export const getProductByIdService = async (id, userId) => {
  return await Product.findOne(id, userId);
};

export const createProductService = async (body, userId) => {
  return await Product.create(body, userId);
};

export const updateProductService = async (filter, body) => {
  return await Product.findOneAndUpdate(filter, body, {
    new: true,
  });
};

export const deleteProductByIdService = async (id, userId) => {
  return await Product.findOneAndDelete(id, userId);
};
