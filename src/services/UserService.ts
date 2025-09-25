import type { IUser, CreateUserRequest } from '../types/user.d';
import { UserRepository } from '../repositories/UserRepository';
import { BadRequestError } from '../utils/index';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async list(page = 1, limit = 10) {
    return this.repo.findMany({}, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' });
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  async create(data: CreateUserRequest) {
    // Check if user already exists
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    return this.repo.create({
      ...data,
      status: 'active'
    });
  }

  async update(id: string, data: Partial<IUser>) {
    // Prevent email changes to existing users (for now)
    if (data.email) {
      const existingUser = await this.repo.findByEmail(data.email);
      if (existingUser && existingUser._id?.toString() !== id) {
        throw new BadRequestError('Email already exists');
      }
    }

    return this.repo.update(id, data);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async updateStatus(id: string, status: IUser['status']) {
    return this.repo.updateStatus(id, status);
  }

  async getByRole(role: IUser['role']) {
    return this.repo.findByRole(role);
  }

  async changePassword(id: string, newPassword: string) {
    return this.repo.changePassword(id, newPassword);
  }
}

export const userService = new UserService(new UserRepository());
