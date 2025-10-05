import axios from 'axios';
import { Store, StoreWithUserRating } from '../types/store.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const storeService = {
  getStores: async (params?: Record<string, any>) => {
    const response = await axios.get<{stores: Store[], totalPages: number}>(`${API_URL}/stores`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response.data;
  },

  getStoresWithUserRatings: async (params?: Record<string, any>) => {
    const response = await axios.get<{stores: StoreWithUserRating[], totalPages: number}>(`${API_URL}/stores/user-ratings`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response.data;
  },

  getStoreById: async (id: string) => {
    const response = await axios.get<Store>(`${API_URL}/stores/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response.data;
  }
};
