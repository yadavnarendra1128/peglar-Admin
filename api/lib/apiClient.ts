import axios from "axios";

console.log(process.env.NEXT_PUBLIC_API_BASE_URL,'base url');
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://31.97.61.201/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://31.97.61.201/api/";

