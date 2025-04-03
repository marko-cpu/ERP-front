import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";


const getCurrentUser = () => {
  return axios.get(API_URL + "users/me", { headers: authHeader() });
};

const UserService = {
  getCurrentUser,
};

export default UserService;