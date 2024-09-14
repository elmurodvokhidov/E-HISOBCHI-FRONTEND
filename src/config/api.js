import axios from "axios";
// const baseURL = "https://backend.e-hisobchi.uz/api";
const baseURL = "https://uitc-crm-api.onrender.com/api";
// const baseURL = "http://localhost:5000/api";
const api = axios.create({ baseURL });
export default api;