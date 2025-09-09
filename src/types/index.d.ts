// Global type definitions for Royal Drive Backend Starter Pack

declare global {
  // Base API Response interface
  interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
  }

  // Pagination interfaces
  interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }

  interface PaginatedResult<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  // Generic Repository interface for future models
  interface IRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: Partial<T>): Promise<T | null>;
    findMany(filter: Partial<T>, options?: PaginationOptions): Promise<PaginatedResult<T>>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
  }

  // Environment variables interface
  interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    MONGODB_TEST_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ALLOWED_ORIGINS: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    LOG_LEVEL: string;
  }
}

export {};

