import { FilterQuery, MongooseError, SortOrder } from 'mongoose';
import { Vehicle } from '../models/vehicle';
import type { IVehicle } from '../types/vehicle.d';


export class VehicleRepository implements IRepository<IVehicle> {
  // Common aggregation pipeline for populating all reference fields
  private getPopulationPipeline(includeInternalFields: boolean = false) {
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

    // Conditionally exclude sensitive internal fields for public access
    if (!includeInternalFields) {
      pipeline.push({
        $project: {
          'internal.acquisitionCost': 0,
          'internal.notes': 0
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
      ...this.getPopulationPipeline(true) // Include internal fields
    ]);
    
    return result[0];
  }

  async findById(id: string): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.getPopulationPipeline(false) // Exclude internal fields for public interface
    ]);
    
    return result[0] || null;
  }

  // Internal method that includes sensitive fields
  async findByIdInternal(id: string): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.getPopulationPipeline(true) // Include internal fields
    ]);
    
    return result[0] || null;
  }

  async findOne(filter: Partial<IVehicle>): Promise<IVehicle | null> {
    const result = await Vehicle.aggregate([
      { $match: filter as FilterQuery<IVehicle> },
      ...this.getPopulationPipeline()
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
      ...this.getPopulationPipeline(),
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
    await Vehicle.findByIdAndUpdate(id, data, { new: true });
    
    // Return the updated document with populated fields (excluding internal for public interface)
    const result = await Vehicle.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.getPopulationPipeline(false)
    ]);
    
    return result[0] || null;
  }

  // Internal update method that includes sensitive fields
  async updateInternal(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    const { Types } = await import('mongoose');
    await Vehicle.findByIdAndUpdate(id, data, { new: true });
    
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

  // Helpers specific to Vehicles
  async findByVinOrStock(vinOrStock: string): Promise<IVehicle | null> {
    const result = await Vehicle.aggregate([
      {
        $match: {
          $or: [
            { vin: vinOrStock },
            { stockNumber: vinOrStock }
          ]
        }
      },
      ...this.getPopulationPipeline()
    ]);
    
    return result[0] || null;
  }

  async getFeatured(limit: number = 10): Promise<IVehicle[]> {
    const result = await Vehicle.aggregate([
      { $match: { 'marketing.featured': true, status: 'available' } },
      ...this.getPopulationPipeline(),
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
        { vin: searchRegex },
        { stockNumber: searchRegex },
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

