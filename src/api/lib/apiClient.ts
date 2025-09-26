import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_BASE_PATH || "http://31.97.61.201").replace(
      /\/$/,
      ""
    ) + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const basePath =
  process.env.NEXT_PUBLIC_API_BASE_PATH || "http://31.97.61.201";
