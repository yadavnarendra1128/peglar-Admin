import { apiClient, basePath } from "../../../api/lib/apiClient";
// QR Code Generation Types and API
export type GenerateBulkQRRequest = {
  product_id: string;
  count: number;
  reward_amount: number;
};

export type GenerateBulkQRResponse = {
  message: string;
  total: number;
  downloadUrl: string;
};
// Helper function to download the Excel file
export const downloadQRExcel = async (downloadUrl: string) => {
  const response = await apiClient.get(downloadUrl, {
    responseType: "blob",
    baseURL: basePath,
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

export const getAllProductQr = async (page = 1, limit = 10) => {
  const res = await apiClient.get(`/productQr/getAllQr?page=${page}&limit=${limit}`);
  return {total:res.data.length,data:res.data.data};
};

export const updateQrReward = async (payload:any) => {
  const res = await apiClient.patch("/productQr/updateQrReward/", payload);
  console.log("DDDDDDDDDDDDDDDDDDDDDDD", res);
  return res.data;
};

export const getQrByValue = async(qrValue:string)=>{
  try{
    const res = await apiClient.get(`/productQr/qrcode/${qrValue}`);
    console.log("qr val", res);
  return res.data;
  }catch(e){
    console.log(e)
  }
}