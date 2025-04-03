import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/accountings";

const getAllAccountings = (page = 0, size = 10) => {
  return axios.get(API_URL + `?page=${page}&size=${size}`, {
    headers: authHeader(),
  });
};

const deleteAccounting = (id) => {
  return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const getAccountingsByStateTwo = () => {
  return axios.get(API_URL + "state-two", { headers: authHeader() });
};

const getAccountingById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const updateAccounting = (id, accountingData) => {
  return axios.put(API_URL + `/${id}`, accountingData, {
    headers: authHeader(),
  });
};

const AccountingService = {
  getAllAccountings,
  deleteAccounting,
  getAccountingsByStateTwo,
  getAccountingById,
  updateAccounting,
};

export default AccountingService;
