// Model definitions for Royal Drive Backend

import { Document, Types } from 'mongoose';

export interface IModel extends Document {
  name: string; // e.g., A4, A6, 3 Series, 5 Series
  slug: string; // e.g., a4, a6, 3-series, 5-series
  make: Types.ObjectId; // Reference to Make model
  vehicleType: Types.ObjectId; // Reference to VehicleType model
  description?: string; // Optional model description
  active: boolean; // Whether the model is currently active
  vehicleCount?: number; // Virtual field for number of vehicles
  createdAt: Date;
  updatedAt: Date;
}

// Filters for listing models
export interface ModelListFilters {
  active?: boolean;
  search?: string; // Search by name
  make?: string; // Filter by make ID
  vehicleType?: string; // Filter by vehicle type ID
}
