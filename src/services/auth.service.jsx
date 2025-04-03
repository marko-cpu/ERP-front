import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  async login(email, password) {
    const response = await axios.post(API_URL + "signin", {
      email,
      password,
    });

    if (response.data.accessToken && response.data.roles.length > 0) {
      localStorage.setItem("user", JSON.stringify(response.data));
    } else {
      localStorage.removeItem("user");
      throw new Error("User has no roles assigned");
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(formData) {
    return axios.post(API_URL + "signup", formData);
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  getCurrentUserRoles() {
    const user = this.getCurrentUser();
    return user?.roles || [];
  }

  hasAnyRole(requiredRoles) {
    const userRoles = this.getCurrentUserRoles();
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}

export default new AuthService();
