import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://fifo-inventory-managment-system.onrender.com"
      : "http://localhost:3000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
