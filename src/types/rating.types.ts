import { User } from '../types/user.types';
import { Store } from '../types/store.types';
export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  user?: User;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  storeId: string;
  rating: number;
}

export interface UpdateRatingRequest {
  rating: number;
}
