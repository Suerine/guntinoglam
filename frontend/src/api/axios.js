import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `📤 API Request: ${req.method.toUpperCase()} ${req.baseURL}${req.url}`,
  );
  return req;
});

API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const url = error.config?.url || "unknown";
    const status = error.response?.status || "no response";
    console.error(`❌ API Error: ${status} ${url}`);
    console.error("Error details:", error.message);

    if (!error.response) {
      console.error("⚠️  CORS or Network Error - Backend might not be running");
      console.error("Backend URL:", import.meta.env.VITE_API_URL);
    }

    return Promise.reject(error);
  },
);

export default API;
