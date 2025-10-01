import { apiClient } from "../../../api/lib/apiClient";
export const handleUpdate = async (id: string, name: string) => {
  const res = await apiClient.put("/categories/" + id, { name });
  return res.data.data;
};
export const createCategory = async (payload: string) => {
  const res = await apiClient.post("/categories", { name: payload });
  return res.data;
};
export const deleteCategory = async (categoryId: string) => {
  const res = await apiClient.delete("/categories/" + categoryId);
  return res.data;
};

export const fetchCategory = async () => {
  const response = await apiClient.get("categories");
  return response.data.data; // <-- Corrected: returns the data array
};
