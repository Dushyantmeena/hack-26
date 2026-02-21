import axios from "axios";

const api = axios.create({
  //baseURL: "",
 baseURL: "http://localhost:3000", // ✅ BACKEND PORT
  withCredentials: true,            // ✅ cookies / auth
  timeout: 130000,                   // 130s safety
});

export default api;
