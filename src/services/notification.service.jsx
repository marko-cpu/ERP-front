import axios from "axios";

const API_URL = "http://localhost:8080/api/notifications";

class Notifications {
  static getNotifications() {
    return axios.get(API_URL, {
      headers: this.getAuthHeader()
    });
  }

  static markAsRead(id) {
    return axios.put(`${API_URL}/${id}/read`, {}, {
      headers: this.getAuthHeader()
    });
  }

  static markAllAsRead() {
    return axios.put(`${API_URL}/read-all`, {}, {
      headers: this.getAuthHeader()
    });
  }

  static deleteNotification(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeader()
    });
  }

  static getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    }
    return {};
  }
}

export default Notifications;