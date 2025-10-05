import axios from 'axios';
import { User } from '../types/user.types';
import { Store } from '../types/store.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const adminService = {
  // Fetch dashboard statistics
  getDashboardStats: async () => {
    const response = await axios.get<{ 
      totalUsers: number;
      totalStores: number;
      totalRatings: number;
    }>(`${API_URL}/admin/dashboard-stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response;
  },

  // Fetch all users with filters, pagination, etc.
  getUsers: async (params?: Record<string, any>) => {
    const response = await axios.get<User[]>(`${API_URL}/admin/users`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response;
  },

  // Create a new user (admin, normal, or store owner)
  createUser: async (userData: Partial<User>) => {
    const response = await axios.post<User>(`${API_URL}/admin/users`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response;
  },

  // Fetch all stores with filters, pagination, etc.
  getStores: async (params?: Record<string, any>) => {
    const response = await axios.get<Store[]>(`${API_URL}/admin/stores`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response;
  },

  // Add a new store
  createStore: async (storeData: Partial<Store>) => {
    const response = await axios.post<Store>(`${API_URL}/admin/stores`, storeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response;
  },
};
