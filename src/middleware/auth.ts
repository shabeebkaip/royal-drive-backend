import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { UnauthorizedError, ForbiddenError } from '../utils/index';
import { env } from '../config/env';
import type { IUser, AuthenticatedRequest } from '../types/user.d';
import { USER_PERMISSIONS } from '../types/user.d';

const userRepository = new UserRepository();

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as any;
    
    const user = await userRepository.findById(decoded.user._id);
    if (!user) {
      throw new UnauthorizedError('Invalid token. User not found.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid token.'));
    }
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!req.user.permissions.includes(permission)) {
      return next(new ForbiddenError(`Access denied. Required permission: ${permission}`));
    }

    next();
  };
};

export const requireRole = (...roles: IUser['role'][]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Required roles: ${roles.join(', ')}`));
    }

    next();
  };
};

export const requireAdmin = requireRole('admin', 'superAdmin');
export const requireSuperAdmin = requireRole('superAdmin');
export const requireInternalAccess = requirePermission(USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL);

export const canViewInternalData = (user?: IUser): boolean => {
  return user?.permissions.includes(USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL) ?? false;
};
