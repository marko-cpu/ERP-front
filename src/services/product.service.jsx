import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/product/";

const getAllProducts = (page = 0, size = 20) => {
  return axios.get(API_URL + `products?page=${page}&size=${size}`, {
    headers: authHeader(),
  });
};

const updateProduct = (productId, updatedProduct) => {
  return axios.put(API_URL + "products/update/" + productId, updatedProduct, {
    headers: authHeader(),
  });
};

const getProductCount = () => {
  return axios.get(API_URL + "product-count", { headers: authHeader() });
};

const getCategoryStats = () => {
  return axios.get(API_URL + "category-stats", {
    headers: authHeader(),
  });
};

const getCategories = () => {
  return axios.get(API_URL + "categories", {
    headers: authHeader(),
  });
};
const addProduct = (product) => {
  return axios.post(API_URL + "products/add", product, {
    headers: authHeader(),
  });
};

const getAllProductsWithoutPagination = () => {
  return axios.get(API_URL + "products/all", {
    headers: authHeader(),
  });
};

const addProductToWarehouse = (warehouseData) => {
  return axios.post(API_URL + "products/addToWarehouse", warehouseData, {
    headers: authHeader(),
  });
};

const getWarehouses = () => {
  return axios.get(API_URL + "warehouses", { headers: authHeader() });
};

const ProductService = {
  getAllProducts,
  updateProduct,
  getProductCount,
  getCategoryStats,
  getCategories,
  addProduct,
  getAllProductsWithoutPagination,
};

export default ProductService;
