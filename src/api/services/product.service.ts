import { apiClient } from "../lib/apiClient";

export type Product = {
  id: string;
  name: string;
  model_no: string;
  offer_id: string;
  qr_count: number;
  reward_amount: number;
  Category: {
    id: string;
    name: {
      en: string;
      hi: string;
      kn: string;
    };
  };
  Subcategory: {
    id: string;
    name: string;
  };
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

export type VariantType = {
  id: string;
  size: string; // Variant size (e.g., L, M, etc.)
  finish: string; // Finish can be null
  color: string; // Color can be null
  price: string; // Price stored as string (e.g., "999.99")
  stock: number; // Stock count
};

export const getProduct = async (productId: string) => {
  const res = await apiClient.get("/product/getProductById/" + productId);
  return res.data.data;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get("/product/getProducts");
  return res.data.data;
};

export const createProduct = async (product: ProductCreation) => {
  const res = await apiClient.post("/product/createProduct", product);
  return res.data;
};

export const updateProduct = async (productId: string, payload: any) => {
  const res = await apiClient.put(
    "/product/updateProduct" + productId,
    payload
  );
  return res.data.data;
};

export const deleteProduct = async (id: string) => {
  try {
    await apiClient.delete(`/product/deleteProduct/${id}`);
  } catch (e:any) {
    console.log(e);
    throw new Error(e.message);
  }
};

// -------------------- variant ----------------------------------------------
export const createVariant = async (data: any) => {
  try {
    const res = await apiClient.post(`/variants`, data);
    return res.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const getVariantsByProductId = async (id: string) => {
  try {
    const res = await apiClient.get(`/variants/product/${id}`);
    return res.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const handleProductVariants = async (productId: string,variants: VariantType[]) => {
  try {
    const res = await apiClient.post(`/variants/handleVariants/${productId}`,variants);
    console.log(res)
    return res.data.data
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};



