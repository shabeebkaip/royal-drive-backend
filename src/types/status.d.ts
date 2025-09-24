// Status definitions for Royal Drive Backend

import { Document } from 'mongoose';

export interface IStatus extends Document {
  name: string; // e.g., Available, Sold, Pending, Reserved, On Hold
  slug: string; // e.g., available, sold, pending, reserved, on-hold
  description?: string; // Optional description of the status
  color?: string; // Optional color code for UI display (e.g., #28a745 for available)
  icon?: string; // Optional icon class or emoji for UI display
  isDefault: boolean; // Whether this is the default status for new vehicles
  active: boolean; // Whether status is active (default: true)
  createdAt: Date;
  updatedAt: Date;
  vehicleCount?: number; // Virtual field for vehicle count
}

// Filters for listing statuses
export interface StatusListFilters {
  search?: string;
  active?: boolean;
  isDefault?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Request interfaces
export interface CreateStatusRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
  active?: boolean;
}

export interface UpdateStatusRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
  active?: boolean;
}

export interface UpdateStatusStatusRequest {
  active: boolean;
}

// Response interfaces
export interface StatusResponse extends IStatus {
  vehicleCount?: number; // Virtual field for vehicle count
}

export interface StatusListResponse {
  statuses: StatusResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StatusStatsResponse {
  total: number;
  active: number;
  inactive: number;
  defaultStatus?: {
    name: string;
    slug: string;
  };
  mostUsed?: {
    name: string;
    vehicleCount: number;
  };
}

export interface StatusDropdownResponse {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}
