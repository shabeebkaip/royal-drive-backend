import { FilterQuery } from 'mongoose';
import { SalesTransaction } from '../models/SalesTransaction.js';
import type { ISalesTransaction, ISalesCreateRequest, ISalesSummaryRow } from '../types/sales.d.js';

interface ListParams {
  status?: string;
  salesperson?: string;
  vehicle?: string;
  from?: Date;
  to?: Date;
  search?: string;
  limit?: number;
  page?: number;
}

export const salesTransactionService = {
  async create(payload: ISalesCreateRequest): Promise<ISalesTransaction> {
    const doc = new SalesTransaction(payload as any);
    const savedDoc = await doc.save();
    
    // If sale is created with completed status, update the vehicle
    if (savedDoc.status === 'completed') {
      const { Vehicle } = await import('../models/vehicle.js');
      await Vehicle.findByIdAndUpdate(savedDoc.vehicle, {
        $set: {
          'internal.saleTransaction': savedDoc._id,
          'internal.actualSalePrice': savedDoc.salePrice,
          'internal.soldDate': savedDoc.closedAt || new Date()
        }
      });
    }
    
    return savedDoc;
  },

  async getById(id: string) {
    return SalesTransaction.findById(id)
      .populate({
        path: 'vehicle',
        populate: [
          { path: 'make', select: 'name slug' },
          { path: 'model', select: 'name slug' },
          { path: 'type', select: 'name' },
          { path: 'engine.fuelType', select: 'name' },
          { path: 'transmission.type', select: 'name' },
          { path: 'drivetrain', select: 'name' },
          { path: 'status', select: 'name' }
        ]
      })
      .populate('salesperson', 'name email role');
  },

  async list(params: ListParams) {
    const filter: FilterQuery<ISalesTransaction> = {};
    if (params.status) filter.status = params.status as any;
    if (params.salesperson) filter.salesperson = params.salesperson as any;
    if (params.vehicle) filter.vehicle = params.vehicle as any;
    if (params.from || params.to) {
      filter.createdAt = {} as any;
      if (params.from) (filter.createdAt as any).$gte = params.from;
      if (params.to) (filter.createdAt as any).$lte = params.to;
    }
    if (params.search) {
      filter.$or = [
        { customerName: { $regex: params.search, $options: 'i' } },
        { customerEmail: { $regex: params.search, $options: 'i' } },
        { externalDealId: { $regex: params.search, $options: 'i' } }
      ];
    }

    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 100) : 25;
    const page = params.page && params.page > 0 ? params.page : 1;

    const query = SalesTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'vehicle',
        populate: [
          { path: 'make', select: 'name slug' },
          { path: 'model', select: 'name slug' },
          { path: 'type', select: 'name' },
          { path: 'engine.fuelType', select: 'name' },
          { path: 'transmission.type', select: 'name' },
          { path: 'drivetrain', select: 'name' },
          { path: 'status', select: 'name' }
        ]
      })
      .populate('salesperson', 'name email role');

    const [items, total] = await Promise.all([
      query.lean(),
      SalesTransaction.countDocuments(filter)
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    };
  },

  async update(id: string, data: Partial<ISalesTransaction>) {
    const doc = await SalesTransaction.findById(id);
    if (!doc) return null;
    if (doc.status !== 'pending' && data.status && data.status !== doc.status) {
      throw new Error('Cannot change status after leaving pending; use transition endpoints');
    }
    Object.assign(doc, data);
    return doc.save();
  },

  async markCompleted(id: string) {
    const doc = await SalesTransaction.findById(id);
    if (!doc) return null;
    if (doc.status !== 'pending') throw new Error('Only pending sales can be completed');
    
    // Complete the sale
    const completedSale = await doc.markCompleted();
    
    // Update the vehicle with sale information
    const { Vehicle } = await import('../models/vehicle.js');
    await Vehicle.findByIdAndUpdate(doc.vehicle, {
      $set: {
        'internal.saleTransaction': doc._id,
        'internal.actualSalePrice': doc.salePrice,
        'internal.soldDate': doc.closedAt || new Date()
      }
    });
    
    return completedSale;
  },

  async markCancelled(id: string) {
    const doc = await SalesTransaction.findById(id);
    if (!doc) return null;
    if (doc.status === 'completed') throw new Error('Cannot cancel a completed sale');
    return doc.markCancelled();
  },

  async remove(id: string) {
    return SalesTransaction.findOneAndDelete({ _id: id, status: 'pending' });
  },

  async summary(params: { from?: Date; to?: Date; salesperson?: string }): Promise<ISalesSummaryRow[]> {
    return (SalesTransaction as any).buildSummary(params as any) as ISalesSummaryRow[];
  }
};
