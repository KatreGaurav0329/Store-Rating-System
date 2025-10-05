import axios from 'axios';
import {
  AuthUser,
  LoginRequest,
  CreateUserRequest,
  UpdatePasswordRequest,
  LoginResponse
} from '../types/user.types';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
  return response.data;
},


  register: async (userData: CreateUserRequest): Promise<void> => {
    await axios.post(`${API_URL}/auth/register`, userData);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await axios.get<AuthUser>(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    return response.data;
  },

  updatePassword: async (passwordData: UpdatePasswordRequest): Promise<void> => {
    await axios.put(`${API_URL}/auth/update-password`, passwordData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }
};
