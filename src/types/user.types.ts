export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  NORMAL_USER = 'NORMAL_USER',
  STORE_OWNER = 'STORE_OWNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export type LoginResponse = {
  token: string;
  user: AuthUser;       
  role: string;
  redirectTo: string;
};