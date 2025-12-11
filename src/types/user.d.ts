export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'superAdmin' | 'admin' | 'manager' | 'salesperson';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  profile?: {
    phone?: string;
    avatar?: string;
    department?: string;
    hireDate?: Date;
  };
  lastLogin?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: IUser['role'];
  permissions?: string[];
  profile?: {
    phone?: string;
    department?: string;
    hireDate?: Date;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<IUser, 'password' | 'passwordResetToken' | 'passwordResetExpires'>;
  token: string;
  expiresIn: string;
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
