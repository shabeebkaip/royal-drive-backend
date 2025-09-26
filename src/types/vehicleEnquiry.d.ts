import { Document, ObjectId } from 'mongoose';

export interface IVehicleEnquiry extends Document {
  _id: ObjectId;
  vehicle: ObjectId;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'both';
  };
  enquiry: {
    type: 'general' | 'financing' | 'trade-in' | 'test-drive' | 'price-negotiation';
    message: string;
    preferredDate?: Date;
    preferredTime?: string;
  };
  interests: {
    testDrive: boolean;
    financing: boolean;
    tradeIn: boolean;
    warranty: boolean;
  };
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: ObjectId; // Admin user assigned to handle this enquiry
  adminNotes: string;
  contactHistory: Array<{
    date: Date;
    method: 'email' | 'phone' | 'in-person';
    notes: string;
    contactedBy: ObjectId; // Admin user who made the contact
  }>;
  source: 'website' | 'phone' | 'showroom' | 'social-media' | 'referral';
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicleEnquiryCreateRequest {
  vehicleId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'both';
  };
  enquiry: {
    type: 'general' | 'financing' | 'trade-in' | 'test-drive' | 'price-negotiation';
    message: string;
    preferredDate?: string;
    preferredTime?: string;
  };
  interests: {
    testDrive?: boolean;
    financing?: boolean;
    tradeIn?: boolean;
    warranty?: boolean;
  };
  source?: 'website' | 'phone' | 'showroom' | 'social-media' | 'referral';
}

export interface IVehicleEnquiryUpdateRequest {
  status?: 'new' | 'contacted' | 'in-progress' | 'completed' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  adminNotes?: string;
  contactHistory?: {
    method: 'email' | 'phone' | 'in-person';
    notes: string;
  };
}

export interface IVehicleEnquiryQuery {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface IVehicleEnquiryStats {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    inProgress: number;
    completed: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byType: {
    general: number;
    financing: number;
    tradeIn: number;
    testDrive: number;
    priceNegotiation: number;
  };
  avgResponseTime: number; // in hours
  conversionRate: number; // percentage of enquiries that result in sales
}
