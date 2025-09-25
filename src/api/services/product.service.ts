import { apiClient } from "../lib/apiClient";

export type Product = {
  id: string;
  name: string;
  model_no: string;
  offer_id: string;
  qr_count: number;
  reward_amount: number;
  categoryId: string;
  subcategoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductCreation = {
  name: string;
  model_no: string;
  // offer_id: string,
  qr_count: number;
  reward_amount: number;
  categoryId: string;
  subcategoryId: string;
};
export const createProduct = async (product: ProductCreation) => {
  const res = await apiClient.post("/product/createProduct", product);
  return res.data;
};
export const deleteProduct = async (id: string) => {
  try {
    await apiClient.delete(`/product/${id}`);
  } catch (e:any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get("/product/getProducts");
  return res.data.data;
};
export const getProduct = async (productId: string) => {
  const res = await apiClient.get("/product/getProductById/" + productId);
  return res.data.data;
};
export const updateProduct = async (productId: string, payload: any) => {
  const res = await apiClient.put(
    "/product/updateProduct" + productId,
    payload
  );
  return res.data.data;
};
