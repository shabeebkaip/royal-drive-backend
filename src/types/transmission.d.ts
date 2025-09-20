// Transmission definitions for Royal Drive Backend

import { Document, Types } from 'mongoose';

export interface ITransmission extends Document {
  name: string; // e.g., Manual, Automatic, CVT, Semi-Automatic
  slug: string; // e.g., manual, automatic, cvt, semi-automatic
  active: boolean; // Whether transmission is active (default: true)
  createdAt: Date;
  updatedAt: Date;
  vehicleCount?: number; // Virtual field for vehicle count
}

// Filters for listing transmissions
export interface TransmissionListFilters {
  search?: string;
  active?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Request interfaces
export interface CreateTransmissionRequest {
  name: string;
  active?: boolean;
}

export interface UpdateTransmissionRequest {
  name?: string;
  active?: boolean;
}

export interface UpdateTransmissionStatusRequest {
  active: boolean;
}

// Response interfaces
export interface TransmissionResponse extends ITransmission {
  vehicleCount?: number; // Virtual field for vehicle count
}

export interface TransmissionListResponse {
  transmissions: TransmissionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
