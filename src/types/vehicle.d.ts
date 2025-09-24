// Vehicle type definitions for Royal Drive Backend

import { Document, Types } from 'mongoose';

// Vehicle interface for car dealership in Ontario, Toronto
export interface IVehicle extends Document {
  // Basic Vehicle Information
  vin?: string; // VIN optional per client
  make: Types.ObjectId; // Reference to Make model
  model: Types.ObjectId; // Reference to Model model
  year: number;
  trim?: string;
  type: Types.ObjectId; // Reference to VehicleType model

  // Engine & Performance
  engine: {
    size: number; // in liters
    cylinders: number;
    fuelType: Types.ObjectId; // Reference to FuelType model
    horsepower?: number;
    torque?: number;
  };

  // Transmission
  transmission: {
    type: Types.ObjectId; // Reference to Transmission model
    speeds?: number;
  };

  // Drivetrain
  drivetrain: Types.ObjectId; // Reference to DriveType model

  // Mileage
  odometer: {
    value: number;
    unit: 'km' | 'miles';
    isAccurate: boolean;
  };

  // Condition & History
  condition: 'new' | 'used' | 'certified-pre-owned';
  accidentHistory: boolean;
  numberOfPreviousOwners: number;

  // CarFax Information
  carfax: {
    reportUrl?: string;
    reportId?: string;
    hasCleanHistory: boolean;
    lastUpdated?: Date;
    serviceRecords?: number;
  };

  // Pricing
  pricing: {
    listPrice: number; // CAD
    currency: 'CAD';
    taxes: {
      hst: number; // 13% in Ontario
      licensing: number;
      other?: number;
    };
    financing: {
      available: boolean;
      rate?: number; // APR
      term?: number; // months
      monthlyPayment?: number;
    };
  };

  // Features & Options
  features: {
    exterior: string[]; // sunroof, alloy wheels, etc.
    interior: string[]; // leather seats, heated seats, etc.
    safety: string[]; // airbags, backup camera, etc.
    technology: string[]; // GPS, bluetooth, etc.
    convenience: string[]; // keyless entry, remote start, etc.
  };

  // Physical Specifications
  specifications: {
    exteriorColor: string;
    interiorColor: string;
    doors: number;
    seatingCapacity: number;
    fuelTankCapacity?: number; // liters
    fuelEconomy: {
      city?: number; // L/100km
      highway?: number; // L/100km
      combined?: number; // L/100km
    };
    dimensions: {
      length?: number; // mm
      width?: number; // mm
      height?: number; // mm
      wheelbase?: number; // mm
      weight?: number; // kg
    };
  };

  // Availability (location removed)

  // Status
  status: Types.ObjectId; // Reference to Status model
  availability: {
    inStock: boolean;
    estimatedArrival?: Date;
    lastUpdated: Date;
  };

  // Media
  media: {
    images: string[]; // URLs to vehicle images
    videos?: string[]; // URLs to vehicle videos
    documents?: string[]; // URLs to documents (warranty, manuals, etc.)
  };

  // Warranty
  warranty: {
    manufacturer: {
      hasWarranty: boolean;
      expiryDate?: Date;
      kilometersRemaining?: number;
      type?: string; // bumper-to-bumper, powertrain, etc.
    };
    extended: {
      available: boolean;
      provider?: string;
      cost?: number;
      duration?: number; // months
    };
  };

  // Ontario Specific
  ontario: {
    emissionTest: {
      required: boolean;
      passed?: boolean;
      expiryDate?: Date;
    };
    safetyStandard: {
      passed: boolean;
      certificationDate?: Date;
      expiryDate?: Date;
      inspector?: string;
    };
    uvip: {
      // Used Vehicle Information Package (required for used vehicles in Ontario)
      required: boolean;
      obtained?: boolean;
      cost: number; // Usually $20
    };
  };

  // Internal Tracking
  internal: {
    stockNumber: string;
    acquisitionDate: Date;
    acquisitionCost?: number;
    daysInInventory: number;
    lastServiceDate?: Date;
    nextServiceDue?: Date;
    assignedSalesperson?: string;
    notes?: string;
  };

  // SEO & Marketing
  marketing: {
    featured: boolean;
    specialOffer?: string;
    keywords: string[];
    description: string;
    slug: string; // for URL generation
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Filters for listing/searching vehicles (location removed)
export interface VehicleListFilters {
  make?: string;
  model?: string;
  year?: number;
  minYear?: number;
  maxYear?: number;
  condition?: IVehicle['condition'];
  fuelType?: string; // ObjectId as string
  transmission?: string; // ObjectId as string  
  drivetrain?: string; // ObjectId as string
  status?: string; // ObjectId as string
  minPrice?: number;
  maxPrice?: number;
}

// Vehicle creation interface - stockNumber is auto-generated
export interface CreateVehicleRequest {
  // Basic Vehicle Information
  vin?: string;
  make: string; // ObjectId as string
  model: string; // ObjectId as string
  year: number;
  trim?: string;
  type: string; // ObjectId as string

  // Engine & Performance
  engine: {
    size: number;
    cylinders: number;
    fuelType: string; // ObjectId as string
    horsepower?: number;
    torque?: number;
  };

  // Transmission
  transmission: {
    type: string; // ObjectId as string
    speeds?: number;
  };

  // Drivetrain
  drivetrain: string; // ObjectId as string

  // Mileage
  odometer: {
    value: number;
    unit: 'km' | 'miles';
    isAccurate: boolean;
  };

  // Condition & History
  condition: 'new' | 'used' | 'certified-pre-owned';
  accidentHistory: boolean;
  numberOfPreviousOwners: number;

  // CarFax Information
  carfax: {
    reportUrl?: string;
    reportId?: string;
    hasCleanHistory: boolean;
    lastUpdated?: Date;
    serviceRecords?: number;
  };

  // Pricing
  pricing: {
    listPrice: number;
    currency: 'CAD';
    taxes: {
      hst: number;
      licensing: number;
      other?: number;
    };
    financing: {
      available: boolean;
      rate?: number;
      term?: number;
      monthlyPayment?: number;
    };
  };

  // Features & Options
  features: {
    exterior: string[];
    interior: string[];
    safety: string[];
    technology: string[];
    convenience: string[];
  };

  // Physical Specifications
  specifications: {
    exteriorColor: string;
    interiorColor: string;
    doors: number;
    seatingCapacity: number;
    fuelTankCapacity?: number;
    fuelEconomy: {
      city?: number;
      highway?: number;
      combined?: number;
    };
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      wheelbase?: number;
      weight?: number;
    };
  };

  // Status
  status: string; // ObjectId as string
  availability: {
    inStock: boolean;
    estimatedArrival?: Date;
  };

  // Media
  media: {
    images: string[];
    videos?: string[];
    documents?: string[];
  };

  // Ontario Specific
  ontario: {
    emissionTest: {
      required: boolean;
      passed?: boolean;
      expiryDate?: Date;
    };
    safetyStandard: {
      passed: boolean;
      certificationDate?: Date;
      expiryDate?: Date;
      inspector?: string;
    };
    uvip: {
      required: boolean;
      obtained?: boolean;
      cost: number;
    };
  };

  // Internal Tracking - stockNumber is auto-generated, acquisitionDate defaults to now
  internal: {
    stockNumber?: string; // Optional - auto-generated if not provided
    acquisitionDate?: Date; // Optional - defaults to now
    acquisitionCost?: number;
    lastServiceDate?: Date;
    nextServiceDue?: Date;
    assignedSalesperson?: string;
    notes?: string;
  };

  // SEO & Marketing
  marketing: {
    featured?: boolean;
    specialOffer?: string;
    keywords?: string[];
    description: string;
    slug?: string; // Auto-generated
  };
}

// Vehicle update interface - everything optional except where business logic requires
export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  // Most fields are optional for updates
}
