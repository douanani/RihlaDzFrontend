import axios from "axios";
import Cookies from "js-cookie"; // ضروري تثبّتو: npm install js-cookie

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor لإضافة X-XSRF-TOKEN من الكوكي
api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export default api;
