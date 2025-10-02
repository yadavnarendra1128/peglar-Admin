import { apiClient } from "../../../api/lib/apiClient";

export const sendNotifications = async (payload: {
  title: string;
  body: string;
  tokens: string[];
  imageUrl: string;
}) => {
  const res = await apiClient.post("pushNotification/sendMany", payload);
  return res.data;
};

export const sendNotification = async (payload: {
  userId: string;
  title: string;
  message: string;
}) => {
  try {
    const res = await apiClient.post("/notifications", payload);
    return res.data;
  } catch (err: any) {
    console.log(err.response.data?.error);
    throw "Failed to verify profile.";
  }
};