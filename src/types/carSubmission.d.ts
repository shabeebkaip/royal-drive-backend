import { Document, ObjectId } from 'mongoose';

export interface ICarSubmission extends Document {
  _id: ObjectId;
  
  // Car Details
  vehicle: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    bodyType: 'sedan' | 'suv' | 'coupe' | 'hatchback' | 'truck' | 'convertible' | 'wagon' | 'other';
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'other';
    transmission: 'manual' | 'automatic' | 'cvt';
    drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
    exteriorColor: string;
    interiorColor: string;
    vin?: string;
    licensePlate?: string;
  };

  // Pricing Information
  pricing: {
    expectedPrice: number;
    currency: string;
    priceFlexible: boolean;
    reasonForSelling: string;
  };

  // Owner Information
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContactMethod?: 'email' | 'phone' | 'either';
    preferredContactTime?: string;
    preferredContact?: 'email' | 'phone' | 'both' | 'either';
    bestTimeToCall?: string;
  };

  // Car History & Features
  history: {
    previousOwners: number;
    accidentHistory: boolean;
    accidentDescription?: string;
    serviceHistory: boolean;
    serviceRecords?: string;
    modifications?: string;
    issues?: string;
  };

  features: {
    airConditioning: boolean;
    powerSteering: boolean;
    powerWindows: boolean;
    powerLocks: boolean;
    cruiseControl: boolean;
    bluetooth: boolean;
    navigation: boolean;
    sunroof: boolean;
    leatherSeats: boolean;
    heatedSeats: boolean;
    backupCamera: boolean;
    parkingSensors: boolean;
    alloyWheels: boolean;
    premiumSound: boolean;
    other?: string[];
  };

  // Images and Documents
  media: {
    images: string[];
    documents?: string[]; // Service records, ownership papers, etc.
  };

  // Admin Management
  status: 'new' | 'reviewing' | 'contacted' | 'scheduled-inspection' | 'inspected' | 'offer-made' | 'negotiating' | 'accepted' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: ObjectId; // Admin user assigned to handle this submission
  
  // Evaluation and Notes
  evaluation?: {
    estimatedValue?: number;
    marketValue?: number;
    condition?: string;
    notes?: string;
    evaluatedBy?: ObjectId;
    evaluatedAt?: Date;
  };

  adminNotes: string;
  
  // Contact History
  contactHistory: Array<{
    date: Date;
    method: 'email' | 'phone' | 'in-person';
    notes: string;
    contactedBy: ObjectId;
  }>;

  // Inspection Details
  inspection?: {
    scheduledDate?: Date;
    completedDate?: Date;
    inspector?: ObjectId;
    location?: string;
    findings?: string;
    recommendedAction?: string;
  };

  // Offer Details
  offer?: {
    amount?: number;
    currency?: string;
    validUntil?: Date;
    conditions?: string;
    status?: 'pending' | 'accepted' | 'rejected' | 'counter-offered';
    madeBy?: ObjectId;
    madeAt?: Date;
  };

  source: 'website' | 'phone' | 'referral' | 'walk-in' | 'social-media';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarSubmissionCreateRequest {
  vehicle: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    bodyType: string;
    fuelType: string;
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
    interiorColor: string;
    vin?: string;
    licensePlate?: string;
  };
  pricing: {
    expectedPrice: number;
    priceFlexible: boolean;
    reasonForSelling: string;
  };
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContactMethod?: 'email' | 'phone' | 'either';
    preferredContactTime?: string;
    preferredContact?: 'email' | 'phone' | 'both' | 'either';
    bestTimeToCall?: string;
  };
  history: {
    previousOwners: number;
    accidentHistory: boolean;
    accidentDescription?: string;
    serviceHistory: boolean;
    serviceRecords?: string;
    modifications?: string;
    issues?: string;
  };
  features: {
    airConditioning?: boolean;
    powerSteering?: boolean;
    powerWindows?: boolean;
    powerLocks?: boolean;
    cruiseControl?: boolean;
    bluetooth?: boolean;
    navigation?: boolean;
    sunroof?: boolean;
    leatherSeats?: boolean;
    heatedSeats?: boolean;
    backupCamera?: boolean;
    parkingSensors?: boolean;
    alloyWheels?: boolean;
    premiumSound?: boolean;
    other?: string[];
  };
  images?: string[];
  source?: 'website' | 'phone' | 'referral' | 'walk-in' | 'social-media';
}

export interface ICarSubmissionUpdateRequest {
  status?: 'new' | 'reviewing' | 'contacted' | 'scheduled-inspection' | 'inspected' | 'offer-made' | 'negotiating' | 'accepted' | 'rejected' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  adminNotes?: string;
  evaluation?: {
    estimatedValue?: number;
    marketValue?: number;
    condition?: string;
    notes?: string;
  };
  inspection?: {
    scheduledDate?: string;
    completedDate?: string;
    location?: string;
    findings?: string;
    recommendedAction?: string;
  };
  offer?: {
    amount?: number;
    validUntil?: string;
    conditions?: string;
    status?: 'pending' | 'accepted' | 'rejected' | 'counter-offered';
  };
  contactHistory?: {
    method: 'email' | 'phone' | 'in-person';
    notes: string;
  };
}

export interface ICarSubmissionQuery {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  make?: string;
  model?: string;
  year?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ICarSubmissionStats {
  total: number;
  byStatus: {
    new: number;
    reviewing: number;
    contacted: number;
    scheduledInspection: number;
    inspected: number;
    offerMade: number;
    negotiating: number;
    accepted: number;
    rejected: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCondition: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  avgExpectedPrice: number;
  avgOfferAmount: number;
  conversionRate: number; // percentage of submissions that result in purchases
  avgProcessingTime: number; // in days
}
