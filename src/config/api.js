import axios from "axios";
const api = axios.create({ baseURL: "https://erp-system-s1pp.onrender.com/api" });
export default api;