import { FilterQuery, MongooseError, SortOrder } from 'mongoose';
import { Vehicle } from '../models/vehicle';
import type { IVehicle } from '../types/vehicle.d';


export class VehicleRepository implements IRepository<IVehicle> {
  // Common aggregation pipeline for populating all reference fields
  private getPopulationPipeline(includeInternalFields: boolean = false, excludeInternalAcquisitionCost: boolean = !false) {
    const pipeline = [
      // Lookup Make
      {
        $lookup: {
          from: 'makes',
          localField: 'make',
          foreignField: '_id',
          as: 'make',
          pipeline: [{ $project: { name: 1, slug: 1, logo: 1 } }]
        }
      },
      { $unwind: { path: '$make', preserveNullAndEmptyArrays: true } },

      // Lookup Model
      {
        $lookup: {
          from: 'models',
          localField: 'model',
          foreignField: '_id',
          as: 'model',
          pipeline: [{ $project: { name: 1, slug: 1, make: 1, vehicleType: 1 } }]
        }
      },
      { $unwind: { path: '$model', preserveNullAndEmptyArrays: true } },

      // Lookup Vehicle Type
      {
        $lookup: {
          from: 'vehicletypes',
          localField: 'type',
          foreignField: '_id',
          as: 'type',
          pipeline: [{ $project: { name: 1, slug: 1, icon: 1 } }]
        }
      },
      { $unwind: { path: '$type', preserveNullAndEmptyArrays: true } },

      // Lookup Status
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
          pipeline: [{ $project: { name: 1, slug: 1, color: 1, isDefault: 1, active: 1 } }]
        }
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },

      // Lookup DriveType
      {
        $lookup: {
          from: 'drivetypes',
          localField: 'drivetrain',
          foreignField: '_id',
          as: 'drivetrain',
          pipeline: [{ $project: { name: 1, slug: 1, active: 1 } }]
        }
      },
      { $unwind: { path: '$drivetrain', preserveNullAndEmptyArrays: true } },

      // Lookup FuelType for engine
      {
        $lookup: {
          from: 'fueltypes',
          localField: 'engine.fuelType',
          foreignField: '_id',
          as: 'engine.fuelTypeData',
          pipeline: [{ $project: { name: 1, slug: 1, active: 1 } }]
        }
      },
      {
        $addFields: {
          'engine.fuelType': { $arrayElemAt: ['$engine.fuelTypeData', 0] }
        }
      },
      { $unset: 'engine.fuelTypeData' },

      // Lookup Transmission Type
      {
        $lookup: {
          from: 'transmissions',
          localField: 'transmission.type',
          foreignField: '_id',
          as: 'transmission.typeData',
          pipeline: [{ $project: { name: 1, slug: 1, active: 1 } }]
        }
      },
      {
        $addFields: {
          'transmission.type': { $arrayElemAt: ['$transmission.typeData', 0] }
        }
      },
      { $unset: 'transmission.typeData' }
    ];

    // Add profit/loss calculations as virtual fields
    pipeline.push({
      $addFields: {
        profitLoss: {
          $cond: {
            if: { $gt: [{ $ifNull: ['$internal.actualSalePrice', 0] }, 0] },
            then: { $subtract: ['$internal.actualSalePrice', { $ifNull: ['$internal.acquisitionCost', 0] }] },
            else: { $subtract: [{ $ifNull: ['$pricing.listPrice', 0] }, { $ifNull: ['$internal.acquisitionCost', 0] }] }
          }
        },
        profitMargin: {
          $cond: {
            if: { $gt: [{ $ifNull: ['$internal.actualSalePrice', 0] }, 0] },
            then: {
              $cond: {
                if: { $eq: ['$internal.actualSalePrice', 0] },
                then: '0.00',
                else: {
                  $toString: {
                    $round: [
                      {
                        $multiply: [
                          { $divide: [
                            { $subtract: ['$internal.actualSalePrice', { $ifNull: ['$internal.acquisitionCost', 0] }] },
                            '$internal.actualSalePrice'
                          ]},
                          100
                        ]
                      },
                      2
                    ]
                  }
                }
              }
            },
            else: {
              $cond: {
                if: { $eq: [{ $ifNull: ['$pricing.listPrice', 0] }, 0] },
                then: '0.00',
                else: {
                  $toString: {
                    $round: [
                      {
                        $multiply: [
                          { $divide: [
                            { $subtract: [{ $ifNull: ['$pricing.listPrice', 0] }, { $ifNull: ['$internal.acquisitionCost', 0] }] },
                            { $ifNull: ['$pricing.listPrice', 1] }
                          ]},
                          100
                        ]
                      },
                      2
                    ]
                  }
                }
              }
            }
          }
        }
      }
    } as any);

    // Conditionally exclude sensitive internal fields for public access
    if (!includeInternalFields && excludeInternalAcquisitionCost) {
      // Exclude entire internal object for public website access (slug-based lookups)
      pipeline.push({
        $project: {
          'internal': 0
        }
      } as any);
    } else if (!includeInternalFields && !excludeInternalAcquisitionCost) {
      // For public detail views (by ID) include some internal fields but hide sensitive ones
      pipeline.push({
        $project: {
          'internal.notes': 0,
          'internal.targetProfit': 0
        }
      } as any);
    }

    return pipeline;
  }

  async create(data: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(data);
    const savedVehicle = await vehicle.save();
    
    // Return the created vehicle with populated fields including internal data
    const { Types } = await import('mongoose');
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(savedVehicle._id as string) } },
  ...this.getPopulationPipeline(true) // Include all internal fields including acquisitionCost
    ]);
    
    return result[0];
  }

  async findById(id: string): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
  ...this.getPopulationPipeline(false, false) // Public detail should include acquisitionCost but hide notes
    ]);
    
    return result[0] || null;
  }

  // Internal method that includes sensitive fields
  async findByIdInternal(id: string): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
  ...this.getPopulationPipeline(true) // Include all internal fields including acquisitionCost
    ]);
    
    return result[0] || null;
  }

  // Find vehicle by slug - OPTIMIZED for Next.js SSR (fast response for website)
  // ALWAYS public (never expose internal data)
  async findBySlug(slug: string): Promise<IVehicle | null> {
    const result = await Vehicle.aggregate([
      // Use indexed field for fast lookup
      { $match: { 'marketing.slug': slug } },
      
      // Lookup only essential fields for website display
      {
        $lookup: {
          from: 'makes',
          localField: 'make',
          foreignField: '_id',
          as: 'make',
          pipeline: [{ $project: { name: 1, slug: 1, logo: 1 } }]
        }
      },
      { $unwind: { path: '$make', preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: 'models',
          localField: 'model',
          foreignField: '_id',
          as: 'model',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      { $unwind: { path: '$model', preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: 'vehicletypes',
          localField: 'type',
          foreignField: '_id',
          as: 'type',
          pipeline: [{ $project: { name: 1, slug: 1, icon: 1 } }]
        }
      },
      { $unwind: { path: '$type', preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
          pipeline: [{ $project: { name: 1, slug: 1, color: 1 } }]
        }
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: 'fueltypes',
          localField: 'engine.fuelType',
          foreignField: '_id',
          as: 'engine.fuelTypeData',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      {
        $addFields: {
          'engine.fuelType': { $arrayElemAt: ['$engine.fuelTypeData', 0] }
        }
      },
      { $unset: 'engine.fuelTypeData' },
      
      {
        $lookup: {
          from: 'transmissions',
          localField: 'transmission.type',
          foreignField: '_id',
          as: 'transmission.typeData',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      {
        $addFields: {
          'transmission.type': { $arrayElemAt: ['$transmission.typeData', 0] }
        }
      },
      { $unset: 'transmission.typeData' },
      
      {
        $lookup: {
          from: 'drivetypes',
          localField: 'drivetrain',
          foreignField: '_id',
          as: 'drivetrain',
          pipeline: [{ $project: { name: 1, slug: 1 } }]
        }
      },
      { $unwind: { path: '$drivetrain', preserveNullAndEmptyArrays: true } },
      
      // Exclude entire internal object for public website
      { $project: { 'internal': 0 } },
      
      // Limit to single result for performance
      { $limit: 1 }
    ]);
    
    return result[0] || null;
  }

  async findOne(filter: Partial<IVehicle>): Promise<IVehicle | null> {
    const result = await Vehicle.aggregate([
      { $match: filter as FilterQuery<IVehicle> },
  ...this.getPopulationPipeline(false, true)
    ]);
    
    return result[0] || null;
  }

  async findMany(
    filter: Partial<IVehicle> = {},
    options?: PaginationOptions
  ): Promise<PaginatedResult<IVehicle>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 as const : 1 as const };

    const pipeline = [
      { $match: filter as FilterQuery<IVehicle> },
  ...this.getPopulationPipeline(false, true),
      { $sort: sort },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }]
        }
      }
    ];

    const result = await Vehicle.aggregate(pipeline);
    const data = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    const pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    };
  }

  async update(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    // Build a $set update to avoid replacing nested objects wholesale
    const updateDoc: any = { $set: {} };
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (key === 'internal' && typeof value === 'object' && value !== null) {
        for (const [innerKey, innerVal] of Object.entries(value as Record<string, any>)) {
          if (innerVal === undefined) continue;
          updateDoc.$set[`internal.${innerKey}`] = innerVal;
        }
      } else {
        updateDoc.$set[key] = value;
      }
    }

    await Vehicle.findByIdAndUpdate(id, updateDoc, { new: true });
    
    // Return the updated document with populated fields (excluding internal for public interface)
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
  ...this.getPopulationPipeline(false, true)
    ]);
    
    return result[0] || null;
  }

  // Internal update method that includes sensitive fields
  async updateInternal(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    const updateDoc: any = { $set: {} };
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (key === 'internal' && typeof value === 'object' && value !== null) {
        for (const [innerKey, innerVal] of Object.entries(value as Record<string, any>)) {
          if (innerVal === undefined) continue;
          updateDoc.$set[`internal.${innerKey}`] = innerVal;
        }
      } else {
        updateDoc.$set[key] = value;
      }
    }

    await Vehicle.findByIdAndUpdate(id, updateDoc, { new: true });
    
    // Return the updated document with populated fields including internal data
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.getPopulationPipeline(true)
    ]);
    
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Vehicle.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Patch method for partial updates using dot notation
  async patch(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    
    // Build $set object with dot notation for nested updates
    const updateDoc: any = { $set: {} };
    
    const flattenObject = (obj: any, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) continue;
        
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          flattenObject(value, fullKey);
        } else {
          updateDoc.$set[fullKey] = value;
        }
      }
    };
    
    flattenObject(data);
    
    // Update the document
    await Vehicle.findByIdAndUpdate(id, updateDoc, { new: true, runValidators: true });
    
    // Return the updated document with populated fields (excluding internal for public interface)
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.getPopulationPipeline(false, false)
    ]);
    
    return result[0] || null;
  }

  // Helpers specific to Vehicles
  async findByVin(vin: string, includeInternalFields: boolean = false): Promise<IVehicle | null> {
    const result = await Vehicle.aggregate([
      {
        $match: {
          vin
        }
      },
  // For detail lookups by VIN/stock, include acquisitionCost for public, and all internal for internal users
  ...this.getPopulationPipeline(includeInternalFields, false)
    ]);
    
    return result[0] || null;
  }

  async getFeatured(limit: number = 10): Promise<IVehicle[]> {
    const result = await Vehicle.aggregate([
      { $match: { 'marketing.featured': true, status: 'available' } },
  ...this.getPopulationPipeline(false, true),
      { $sort: { createdAt: -1 as const } },
      { $limit: limit }
    ]);
    
    return result;
  }

  async search(
    q: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IVehicle>> {
    const searchRegex = new RegExp(q, 'i');
  const filter: FilterQuery<IVehicle> = {
      $or: [
        { make: searchRegex },
        { model: searchRegex },
        { 'marketing.keywords': { $in: [searchRegex] } },
        { 'marketing.description': searchRegex },
    { vin: searchRegex }
      ],
    } as any;

    return this.findMany(filter as any, { ...options, sortBy: 'createdAt', sortOrder: 'desc' });
  }

  async updateStatus(id: string, status: IVehicle['status']): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    await Vehicle.findByIdAndUpdate(
      id,
      { status, 'availability.lastUpdated': new Date() },
      { new: true }
    );

    // Return updated document with populated status field
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
          pipeline: [{ $project: { name: 1, slug: 1, color: 1, isDefault: 1, active: 1 } }]
        }
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, status: 1, 'availability.lastUpdated': 1 } }
    ]);
    
    return result[0] || null;
  }
}

