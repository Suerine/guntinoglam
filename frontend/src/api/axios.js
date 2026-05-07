import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // "https://gof-ecommerce-website.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
