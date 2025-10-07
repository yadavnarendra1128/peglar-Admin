import { User } from "@/types/user";
import { apiClient,basePath } from "../../../api/lib/apiClient";
import axios from 'axios'

export type Product = {
  id: string;
  name: string;
  model_no: string;
  offer_id: string;
  qr_count: number;
  reward_amount: number;
  Category: {
  id:string;
  name: {
    en:string;
    hi:string;
    kn:string
  }
};
  Subcategory: {
  id: string;
  name: string;
};
  categoryId: string;
  subcategoryId: string;
  createdAt: string;
  updatedAt: string;
  media: MediaType[]
};

export type ProductType = {
  name: string;
  model_no: string;
  base_price:number;
  dummy_price:number;
  material:string;
  finish: string;
  description:string;
  categoryId: string;
  subcategoryId: string;
  media:MediaType[]
};

export type MediaType = {
  url: string;
  mediaType: "image" | "video";
};

// ============ Withdrawals ============
export const getAllWithdrawals = async () => {
  const res = await apiClient.get("/withdrawal/withdrawals");
  console.log(res.data, "withdrawals data");
  return res.data;
};

export const createCategory = async (data: any) => {
  const response = await apiClient.post("categories", data);
  return response.data; // <-- Added .data to return the actual data
};

export const fetchCategory = async () => {
  const response = await apiClient.get("categories");
  return response.data.data; // <-- Corrected: returns the data array
};

// ============ Users ============
export type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImg?: string | null;
  userType: "customer" | "dealer" | "carpenter" | "admin";
  aadhar?: { aadharNumber: string; aadharImage: string };
  panDetail?: { panNumber: string; pamImage: string };
  isVerified: boolean;
  lifetime_earning: string;
  createdAt: string;
  updatedAt: string;
  fcm?: string;
  is_active: boolean;
};

// ============ User ============ 
export const getAllCarpenters = async (): Promise<BackendUser[]> => {
  try {
    const res = await apiClient.get("/users/all-carpenter");
    return res.data.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const getAllUsers = async (): Promise<BackendUser[]> => {
  try {
  const res = await apiClient.get("/users");
  return res.data.data;
}catch(e:any){
 console.log(e);
 throw new Error(e.message);
   }
};

export const getAllCustomers = async (): Promise<BackendUser[]> => {
  try {
    const res = await apiClient.get("/users/all-customer");
    return res.data.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const getAllDealers = async (): Promise<BackendUser[]> => {
  try {
    const res = await apiClient.get("/users/all-dealer");
    return res.data.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const getProfile = async ()=>{
   try {
     const res = await apiClient.get(`/users/me`);
     console.log(res,'prof')
     return res.data.user
   } catch (e:any) {
     console.log(e);
     throw new Error(e.message);
   }
}

export const getUserById = async (id:string): Promise<BackendUser> => {
   try {
     const res = await apiClient.get(`/users/userId/${id}`);
     return res.data.user.data;
   } catch (e:any) {
     console.log(e);
     throw new Error(e.message);
   }
};

export const updateUser = async (id: string,payload:any) => {
  try {
    const res = await apiClient.put(`/users/${id}`,payload);
    return res.data.user
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const deleteUser = async (id:string)=>{
  try{
    await apiClient.delete(`/users/delete/${id}`)
  }catch(e:any){
    console.log(e);
    throw new Error(e.message)
  }
}

export const registerUser = async(payload:any)=>{
  const formData = new FormData();
formData.append("name", payload.name);
formData.append("phone", payload.phone);

// Stringify JSON details
formData.append("aadhar", JSON.stringify({ aadharNumber: payload.aadharNumber }));
formData.append("panDetails", JSON.stringify({ panNumber: payload.panNumber }));

// Append files
formData.append("aadharImage", payload.aadharFile);
formData.append("panImage", payload.panFile);

  try{
    const res = await axios.post(`/users/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res)
    return res
  }catch(e){
    console.log(e)
  }
}

// ============ Product ============

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get("/product/getProducts");
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

export const getVariantsByProductId = async (id:string)=>{
  try {
    const res = await apiClient.get(`/variants/product/${id}`);
    return res.data
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
}

export const createVariant = async (data:any)=>{
   try {
     const res = await apiClient.post(`/variants`,data);
     return res.data;
   } catch (e: any) {
     console.log(e);
     throw new Error(e.message);
   }
}

// ============ Subcategories ============
export type CreateSubcategoryDto = {
  name: string;
  categoryId: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export const createSubcategory = async (
  payload:CreateSubcategoryDto
): Promise<{status:'success'|'error',message:string,data:Subcategory}> => {
  const res = await apiClient.post("/subcategories", payload);
  return res.data
};

// QR Code Generation Types and API
export type GenerateBulkQRRequest = {
  product_id: string;
  count: number;
};

export type GenerateBulkQRResponse = {
  message: string;
  total: number;
  downloadUrl: string;
};

export const generateBulkQRCodes = async (
  payload: GenerateBulkQRRequest
): Promise<GenerateBulkQRResponse> => {
  const res = await apiClient.post("/productQr/generate-bulk", payload);
  if (res.status !== 200) {
    console.log("Failed to generate QR codes");
  }
  console.log(res.data, "QR codes data");
  return res.data;
};

// Helper function to download the Excel file
export const downloadQRExcel = async (downloadUrl: string) => {
  const response = await apiClient.get(downloadUrl, {
    responseType: "blob",
    baseURL: "http://13.127.33.2:5000/",
  });

  // Try to get filename from Content-Disposition header
  let fileName = "qr_codes.xlsx";
  const contentDisposition = response.headers["content-disposition"];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) fileName = match[1];
  }

  // Create a blob and trigger download
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
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

export const getAllProductQr = async () => {
  const res = await apiClient.get("/productQr/getAllQr");
  return res.data.data;
}

// ============ Categories ============
// export type Category = {
//   id: string;
//   name: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export const createCategory = async (
//   payload: Omit<Category, "id">
// ): Promise<Category> => {
//   const res = await apiClient.post("/categories", payload);
//   return res.data;
// };

// export const fetchCategory = async (): Promise<Category[]> => {
//   const res = await apiClient.get("/categories");
//   return res.data;
// };

// ============ Auth ============
export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  data: User
};

export const loginApi = async (payload: LoginDto): Promise<LoginResponse> => {
  try{
  const res = await apiClient.post("/users/login", payload);
  return res.data;
  }catch(err: any){
    console.log(err.response.data?.error);
    throw (
      err.response.data?.error || err?.message || "Invalid credentials"
    );
  }
};

export const getProfileApi = async (): Promise<User> => {
  try {
    const res = await apiClient.get("/users/me");
    return res.data.user;
  } catch (err: any) {
    console.log(err.response.data?.error);
    throw 'User not found.' 
  }
};

// ------ upload ---------------
export const uploadFile = async (file:File, section:string):Promise<MediaType> => {
  try {
        const formData = new FormData();
    formData.append("section", section);
    formData.append("media", file);
    const res = await axios.post(
      `${basePath + '/api/upload'}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err: any) {
    console.log(err.response.data?.error);
    throw "Failed to upload image.";
  }
};

export const deleteFile = async (body:{
  fileName : string
}): Promise<{status:string;message:string,fileName:string}> => {
  try {
    const res = await apiClient.delete(`/upload`, {
      data: body,
    });
    return res.data;
  } catch (err: any) {
    console.log(err.response.data?.error);
    throw "Failed to upload image.";
  }
};

// export const profileVerification = async (userId: string) => {
//   try{
//   const payload = {
//     userId,
//     title: "Updates",
//     message: "Profile Verified",
//   };

//   const res = await apiClient.post("/notifications", payload);
//   return res.data.data;
// }catch(err:any){
//   console.log(err.response.data?.error);
//   throw "Failed to verify profile.";
// }};