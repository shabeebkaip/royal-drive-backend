// Drive Type definitions for Royal Drive Backend

import { Document } from 'mongoose';

export interface IDriveType extends Document {
  name: string; // e.g., Front-Wheel Drive, Rear-Wheel Drive, All-Wheel Drive, 4-Wheel Drive
  slug: string; // e.g., front-wheel-drive, rear-wheel-drive, all-wheel-drive, 4-wheel-drive
  active: boolean; // Whether drive type is active (default: true)
  createdAt: Date;
  updatedAt: Date;
  vehicleCount?: number; // Virtual field for vehicle count
}

// Filters for listing drive types
export interface DriveTypeListFilters {
  search?: string;
  active?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Request interfaces
export interface CreateDriveTypeRequest {
  name: string;
  active?: boolean;
}

export interface UpdateDriveTypeRequest {
  name?: string;
  active?: boolean;
}

export interface UpdateDriveTypeStatusRequest {
  active: boolean;
}

// Response interfaces
export interface DriveTypeResponse extends IDriveType {
  vehicleCount?: number; // Virtual field for vehicle count
}

export interface DriveTypeListResponse {
  driveTypes: DriveTypeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DriveTypeStatsResponse {
  total: number;
  active: number;
  inactive: number;
  mostUsed?: {
    name: string;
    vehicleCount: number;
  };
}

export interface DriveTypeDropdownResponse {
  _id: string;
  name: string;
  code: string;
  slug: string;
}
