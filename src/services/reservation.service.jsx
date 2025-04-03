import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/reservations';


const ReservationService = {
  getAllReservations: (page, size) => {
    return axios.get(API_URL, {
      params: { page, size },
      headers: authHeader()
    });
  },

  getReservationById: (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  },

  updateReservation: (id, updatedData) => {
    return axios.put(`${API_URL}/${id}`, updatedData, { headers: authHeader() });
  },

  deleteReservation: (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
};



export default ReservationService;