import { apiClient } from "@/api/lib/apiClient"


export const sendNotifications = async (
    payload: {
        title: string;
        body: string;
        tokens: string[];
        imageUrl: string
    }) => {
    const res = await apiClient.post("pushNotification/sendMany", payload)
    return res.data

}