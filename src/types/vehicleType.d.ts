// Vehicle Type definitions for Royal Drive Backend

import { Document } from 'mongoose';

export interface IVehicleType extends Document {
  name: string; // e.g., SUV, Hatchback, Sedan, Coupe
  slug: string; // e.g., suv, hatchback, sedan, coupe
  icon?: string; // URL to type icon image
  description?: string; // Optional type description
  active: boolean; // Whether the vehicle type is currently active
  vehicleCount?: number; // Virtual field for number of vehicles
  createdAt: Date;
  updatedAt: Date;
}

// Filters for listing vehicle types
export interface VehicleTypeListFilters {
  active?: boolean;
  search?: string; // Search by name
}
