import { FilterQuery } from 'mongoose';
import { User } from '../models/User.js';
import type { IUser } from '../types/user.d.js';

export class UserRepository implements IRepository<IUser> {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findOne(filter: Partial<IUser>): Promise<IUser | null> {
    return User.findOne(filter as FilterQuery<IUser>).exec();
  }

  async findMany(
    filter: Partial<IUser> = {},
    options?: PaginationOptions
  ): Promise<PaginatedResult<IUser>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 as const : 1 as const };

    const [data, total] = await Promise.all([
      User.find(filter as FilterQuery<IUser>)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      User.countDocuments(filter as FilterQuery<IUser>)
    ]);

    const pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    };
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec();
    return !!result;
  }

  // User-specific methods
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  async findActiveUsers(): Promise<IUser[]> {
    return User.find({ status: 'active' }).exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLogin: new Date() }).exec();
  }

  async findByRole(role: IUser['role']): Promise<IUser[]> {
    return User.find({ role, status: 'active' }).exec();
  }

  async changePassword(id: string, newPassword: string): Promise<IUser | null> {
    const user = await User.findById(id).exec();
    if (!user) return null;
    
    user.password = newPassword;
    return await user.save();
  }

  async updateStatus(id: string, status: IUser['status']): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { passwordResetToken: token, passwordResetExpires: expires },
      { new: true }
    ).exec();
  }

  async findByPasswordResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires').exec();
  }

  async clearPasswordResetToken(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } },
      { new: true }
    ).exec();
  }
}
