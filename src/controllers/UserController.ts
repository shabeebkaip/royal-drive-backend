import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/AuthService';
import { userService } from '../services/UserService';
import { createApiResponse } from '../utils/index';
import type { AuthenticatedRequest, LoginRequest, CreateUserRequest } from '../types/user.d';

export class UserController {
  // Login
  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(false, 'Validation failed', null, errors.array()[0].msg);
        res.status(400).json(response);
        return;
      }

      const loginData: LoginRequest = req.body;
      const result = await authService.login(loginData);

      const response = createApiResponse(true, 'Login successful', result);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const response = createApiResponse(false, 'User not authenticated');
        res.status(401).json(response);
        return;
      }

      const response = createApiResponse(true, 'Profile retrieved successfully', req.user);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get all users (Admin only)
  static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.list(page, limit);
      const response = createApiResponse(true, 'Users retrieved successfully', result);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Create new user (Admin only)
  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(false, 'Validation failed', null, errors.array()[0].msg);
        res.status(400).json(response);
        return;
      }

      const userData: CreateUserRequest = req.body;
      const user = await authService.createUser(userData);

      const response = createApiResponse(true, 'User created successfully', user);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update user status (Admin only)
  static async updateUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Prevent deactivating own account
      if (req.user?._id?.toString() === id && status !== 'active') {
        const response = createApiResponse(false, 'Cannot deactivate your own account');
        res.status(400).json(response);
        return;
      }

      const user = await userService.updateStatus(id, status);
      if (!user) {
        const response = createApiResponse(false, 'User not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(true, 'User status updated successfully', user);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
