import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/warehouses/";

const getAllWarehouses = (page = 0, size = 5) => {
  return axios.get(API_URL + "getAllWarehouses", {
    params: {
      page: page,
      size: size,
    },
    headers: authHeader(),
  });
};

const getWarehouseById = (id) => {
  return axios.get(API_URL + id, { headers: authHeader() });
};

const deleteWarehouse = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};
const createWarehouse = (warehouseName, location) => {
  return axios.post(
    API_URL + "addWarehouse",
    { warehouseName, location },
    { headers: authHeader() }
  );
};

const WarehouseService = {
  getAllWarehouses,
  getWarehouseById,
  deleteWarehouse,
  createWarehouse,
};

export default WarehouseService;
