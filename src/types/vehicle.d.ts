// Vehicle type definitions for Royal Drive Backend

import { Document } from 'mongoose';

// Vehicle interface for car dealership in Ontario, Toronto
export interface IVehicle extends Document {
  // Basic Vehicle Information
  vin: string; // Vehicle Identification Number (required by OMVIC)
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType: string; // sedan, SUV, coupe, hatchback, truck, etc.

  // Engine & Performance
  engine: {
    size: number; // in liters
    cylinders: number;
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'plug-in-hybrid';
    horsepower?: number;
    torque?: number;
  };

  // Transmission
  transmission: {
    type: 'manual' | 'automatic' | 'cvt';
    speeds?: number;
  };

  // Drivetrain
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';

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
    msrp?: number; // Manufacturer's Suggested Retail Price
    dealerCost?: number;
    tradeInValue?: number;
    marketValue?: number;
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

  // Location & Availability
  location: {
    dealershipName: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  // Status
  status: 'available' | 'sold' | 'pending' | 'reserved' | 'on-hold';
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
