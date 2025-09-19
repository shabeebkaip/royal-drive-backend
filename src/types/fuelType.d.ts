// Fuel Type definitions for Royal Drive Backend

import { Document } from 'mongoose';

export interface IFuelType extends Document {
  name: string; // e.g., Gasoline, Petrol, Hybrid, Electric, Diesel
  slug: string; // e.g., gasoline, petrol, hybrid, electric, diesel
  active: boolean; // Whether the fuel type is currently active
  vehicleCount?: number; // Virtual field for number of vehicles
  createdAt: Date;
  updatedAt: Date;
}

// Filters for listing fuel types
export interface FuelTypeListFilters {
  active?: boolean;
  search?: string; // Search by name
}
