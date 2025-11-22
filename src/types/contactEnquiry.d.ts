import { Document, ObjectId } from 'mongoose';

export interface IContactEnquiry extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: 'General Inquiry' | 'Vehicle Information' | 'Financing Question' | 'Trade-in Valuation' | 'Service Question';
  message: string;
  status: 'new' | 'contacted' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'phone' | 'email' | 'social-media' | 'referral';
  assignedTo?: ObjectId;
  notes: Array<{
    content: string;
    createdBy: ObjectId;
    createdAt: Date;
  }>;
  contactHistory: Array<{
    date: Date;
    method: 'email' | 'phone' | 'in-person';
    notes: string;
    contactedBy: ObjectId;
  }>;
  resolvedAt?: Date;
  resolvedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  fullName: string; // Virtual field
  markAsResolved(userId: ObjectId): Promise<IContactEnquiry>;
  addNote(content: string, userId: ObjectId): Promise<IContactEnquiry>;
  addContactHistory(method: string, notes: string, userId: ObjectId): Promise<IContactEnquiry>;
}

export interface IContactEnquiryCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: 'General Inquiry' | 'Vehicle Information' | 'Financing Question' | 'Trade-in Valuation' | 'Service Question';
  message: string;
  source?: 'website' | 'phone' | 'email' | 'social-media' | 'referral';
}

export interface IContactEnquiryUpdateRequest {
  status?: 'new' | 'contacted' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: {
    content: string;
  };
  contactHistory?: {
    method: 'email' | 'phone' | 'in-person';
    notes: string;
  };
}

export interface IContactEnquiryQuery {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  subject?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}
