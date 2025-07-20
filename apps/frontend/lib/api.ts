import axios from "axios";
import Cookies from "js-cookie";
import { CookieNames } from "@/types/enum";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(CookieNames.jwtToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
