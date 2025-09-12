// Make/Brand type definitions for Royal Drive Backend

import { Document } from 'mongoose';

export interface IMake extends Document {
  name: string; // e.g., BMW, Toyota, Mercedes-Benz
  slug: string; // e.g., bmw, toyota, mercedes-benz
  logo?: string; // URL to logo image
  description?: string; // Optional brand description
  active: boolean; // Whether the make is currently active
  vehicleCount?: number; // Virtual field for number of vehicles
  createdAt: Date;
  updatedAt: Date;
}

// Filters for listing makes
export interface MakeListFilters {
  active?: boolean;
  search?: string; // Search by name
}
