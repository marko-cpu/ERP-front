import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

const updateUserRoles = (id, roles) => {
  return axios.put(API_URL + `users/${id}/roles`, roles, {
    headers: authHeader(),
  });
};

const updateUser = (userId, userData) => {
  return axios.put(API_URL + `users/${userId}`, userData, {
    headers: authHeader(),
  });
};

const getRoles = () => {
  return axios.get(API_URL + "roles", {
    headers: authHeader(),
  });
};

const getUsersCount = () => {
  return axios.get(API_URL + "user-count", {
    headers: authHeader(),
  });
};

const getAllUsers = (page = 0, size = 5) => {
  return axios.get(API_URL + `users?page=${page}&size=${size}`, {
    headers: authHeader(),
  });
};

const AdminService = {
  updateUserRoles,
  updateUser,
  getRoles,
  getUsersCount,
  getAllUsers,
};

export default AdminService;
