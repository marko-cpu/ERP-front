import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/invoices/";

const getAllInvoices = (page = 0, size = 5) => {
  return axios.get(API_URL + "getAllInvoice", {
    params: {
      page: page,
      size: size,
    },
    headers: authHeader(),
  });
};

const findInvoicesByPayDate = (payDate) => {
  return axios.get(API_URL + "pay-date", {
    params: { payDate },
    headers: authHeader(),
  });
};

const deleteInvoice = (id) => {
  return axios.delete(API_URL + id, {
    headers: authHeader(),
  });
};

const updateInvoice = (id, invoiceData) => {
  return axios.put(API_URL + id, invoiceData, {
    headers: authHeader(),
  });
};

const getProductsSoldStats = () => {
  return axios.get(API_URL + "products-sold-stats", { headers: authHeader() });
};

const downloadInvoicePdf = (id) => {
  return axios.get(API_URL + `${id}/pdf`, {
    headers: authHeader(),
    responseType: 'blob',
  });
};

const InvoiceService = {
  getAllInvoices,
  findInvoicesByPayDate,
  deleteInvoice,
  updateInvoice,
  getProductsSoldStats,
  downloadInvoicePdf
};

export default InvoiceService;
