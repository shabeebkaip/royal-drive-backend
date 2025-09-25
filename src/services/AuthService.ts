import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import type { IUser, LoginRequest, LoginResponse, CreateUserRequest } from '../types/user.d';
import { UnauthorizedError, BadRequestError } from '../utils/index';
import { env } from '../config/env';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    // Find user by email (password included)
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await this.userRepo.updateLastLogin(user._id as string);

    // Generate JWT token
    const token = this.generateToken(user);

    // Remove password from response by converting to plain object
    const userObj = (user as any).toObject();
    const { password: _, passwordResetToken, passwordResetExpires, ...userResponse } = userObj;

    return {
      user: userResponse,
      token,
      expiresIn: env.JWT_EXPIRES_IN
    };
  }

  async createUser(userData: CreateUserRequest): Promise<IUser> {
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Validate password strength
    this.validatePassword(userData.password);

    // Create user
    const user = await this.userRepo.create({
      ...userData,
      status: 'active'
    });

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByEmail(''); // Get user with password
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await (user as any).comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Update password
    await this.userRepo.changePassword(userId, newPassword);
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestError('No user found with this email address');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userRepo.setPasswordResetToken(user._id as string, hashedToken, expires);

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await this.userRepo.findByPasswordResetToken(hashedToken);
    if (!user) {
      throw new BadRequestError('Password reset token is invalid or has expired');
    }

    this.validatePassword(newPassword);

    // Reset password and clear reset token
    await this.userRepo.changePassword(user._id as string, newPassword);
    await this.userRepo.clearPasswordResetToken(user._id as string);
  }

  verifyToken(token: string): IUser {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      return decoded.user;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  private generateToken(user: IUser): string {
    const payload = {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    };

    return jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: env.JWT_EXPIRES_IN
    } as any);
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new BadRequestError('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new BadRequestError('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new BadRequestError('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      throw new BadRequestError('Password must contain at least one special character (@$!%*?&)');
    }
  }
}

export const authService = new AuthService(new UserRepository());
