import { Document, ObjectId } from 'mongoose';

export interface ISalesTransaction extends Document {
  _id: ObjectId;
  vehicle: ObjectId;            // Vehicle sold
  customerName: string;         // Simple denormalized customer display
  customerEmail?: string;
  salePrice: number;            // Final sale price (before tax)
  currency: 'CAD' | 'USD';
  costOfGoods?: number;         // Acquisition cost snapshot (for margin calc)
  margin?: number;              // salePrice - costOfGoods
  marginPercent?: number;       // Virtual: margin / salePrice
  salesperson?: ObjectId;       // User handling sale
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'finance' | 'lease';
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;              // When completed
  // Extended financial fields
  discount?: number;            // Absolute discount amount
  taxRate?: number;             // 0-1 fraction
  taxAmount?: number;           // Computed tax
  grossPrice?: number;          // Base sale price (pre-discount)
  totalPrice?: number;          // Final amount after discount + tax
  externalDealId?: string;
  notes?: string;
  meta?: Record<string, any>;
  recalculateFinancials(): void;
  markCompleted(): Promise<ISalesTransaction>;
  markCancelled(): Promise<ISalesTransaction>;
}

export interface ISalesCreateRequest {
  vehicle: string;
  customerName: string;
  customerEmail?: string;
  salePrice: number;
  currency?: 'CAD' | 'USD';
  costOfGoods?: number;
  salesperson?: string;
  paymentMethod?: 'cash' | 'finance' | 'lease';
  status?: 'pending' | 'completed' | 'cancelled';
  closedAt?: string;
  discount?: number;
  taxRate?: number;
  externalDealId?: string;
  notes?: string;
  meta?: Record<string, any>;
}

export interface ISalesSummaryRow {
  _id: string; // status
  count: number;
  totalRevenue: number;
  totalGross: number;
  totalMargin: number;
}
