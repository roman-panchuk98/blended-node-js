import { Product } from '../models/product.js';

export const getAllProductsService = async () => {
  return await Product.find();
};

export const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

export const createProductService = async (body) => {
  return await Product.create(body);
};

export const updateProductService = async (id, body) => {
  return await Product.findOneAndUpdate({ _id: id }, body, {
    new: true,
  });
};

export const deleteProductByIdService = async (id) => {
  return await Product.findOneAndDelete({ _id: id });
};
