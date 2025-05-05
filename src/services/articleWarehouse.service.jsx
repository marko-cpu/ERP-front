import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/article-warehouse";

const getAllArticles = (page = 0, size = 5) => {
  return axios.get(API_URL, {
    params: {
      page: page,
      size: size,
    },
    headers: authHeader(),
  });
};
const getArticlesByWarehouse = (warehouseId, page = 0, size = 5) => {
  return axios.get(`${API_URL}/warehouse/${warehouseId}`, {
    params: { page, size },
    headers: authHeader(),
  });
};

const getWarehousesByProduct = (productId) => {
  return axios.get(`${API_URL}/product/${productId}`, {
    headers: authHeader(),
  });
};

const deleteArticleWarehouse = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const updateArticleWarehouse = (articleId, quantity, purchasePrice) => {
  return axios.put(
    `${API_URL}/update/${articleId}`,
    { quantity, purchasePrice },
    { headers: authHeader() }
  );
};


const updatePurchasePrice = (productId, newPrice) => {
  return axios.put(
    API_URL + productId,
    { purchasePrice: newPrice },
    { headers: authHeader() }
  );
};

const ArticleWarehouseService = {
  getAllArticles,
  updatePurchasePrice,
  getArticlesByWarehouse,
  getWarehousesByProduct,
  deleteArticleWarehouse,
  updateArticleWarehouse
};

export default ArticleWarehouseService;
