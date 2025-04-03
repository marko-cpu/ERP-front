import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/orders/";

const getAllOrders = (page = 0, size = 10) => {
  return axios.get(API_URL + `getOrders?page=${page}&size=${size}`, {
    headers: authHeader(),
  });
};

const getOrderCount = () => {
  return axios.get(API_URL + "order-count", { headers: authHeader() });
};

const getOrderById = (orderId) => {
  return axios.get(`${API_URL}${orderId}`, {
    headers: authHeader(),
  });
};

const createOrder = (orderData) => {
  return axios.post(`${API_URL}CreateOrders`, orderData, {
    headers: authHeader(),
  });
};

const getCustomers = () => {
  return axios.get(API_URL + "customers", { headers: authHeader() });
};

const searchCustomers = (query) => {
  return axios.get(API_URL + "customers/search?query=" + query, {
    headers: authHeader(),
  });
};

const checkCustomerExists = (email) => {
  return axios.get(API_URL + "customers/check?email=" + email, {
    headers: authHeader(),
  });
};

const OrderService = {
  getAllOrders,
  getOrderCount,
  getOrderById,
  createOrder,
  searchCustomers,
  getCustomers,
  checkCustomerExists,
};

export default OrderService;
