import { apiClient } from "../lib/apiClient";

export type CreateSubcategoryDto = {
  name: string;
  categoryId: string;
};

 type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  is_active:string
};

export const createSubcategory = async (
  payload: CreateSubcategoryDto
): Promise<Subcategory> => {
  const res = await apiClient.post("/subcategories", payload);
  return res.data;
};

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const res = await apiClient.get("/subcategories");
  return res.data.data;
};

export const updateSubcategory = async (
  id: string,
  payload: Partial<CreateSubcategoryDto>
): Promise<Subcategory> => {
  const res = await apiClient.put(`/subcategories/${id}`, payload);
  return res.data;
};

export const deleteSubcategory = async (id: string) => {
  const res = await apiClient.delete(`/subcategories/${id}`);
  return res.data;
};