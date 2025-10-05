import { User } from '../types/user.types';
export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: User;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface StoreWithUserRating extends Store {
  userRating?: number;
}
