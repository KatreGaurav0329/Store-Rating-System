import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const accountService = {
  // oldPassword and newPassword keys must match your backend expectations!
  changePassword: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    return await axios.post(
      `${API_URL}/auth/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      }
    );
  },
};
