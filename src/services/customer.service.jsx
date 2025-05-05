import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/customers";

const CustomerService = {
  getAllCustomers(page = 0, size = 5) {
    return axios.get(API_URL, {
      params: { page, size },
      headers: authHeader(),
    });
  },
  getCustomerCount() {
    return axios.get(API_URL + "/count", { 
      headers: authHeader() 
    });
  },

  getCustomerById(id) {
    return axios.get(API_URL + `/${id}`, { headers: authHeader() });
  },

  createCustomer(customer) {
    return axios.post(API_URL, customer, { headers: authHeader() });
  },

  updateCustomer(id, customer) {
    return axios.put(API_URL + `/${id}`, customer, { headers: authHeader() });
  },

  deleteCustomer(id) {
    return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
  },
};

export default CustomerService;