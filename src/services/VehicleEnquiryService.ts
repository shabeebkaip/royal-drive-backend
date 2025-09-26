import { VehicleEnquiry, IVehicleEnquiry } from '../models/VehicleEnquiry';
import { 
  IVehicleEnquiryCreateRequest, 
  IVehicleEnquiryUpdateRequest, 
  IVehicleEnquiryQuery,
  IVehicleEnquiryStats 
} from '../types/vehicleEnquiry.d';

export class VehicleEnquiryService {
  
  /**
   * Create a new vehicle enquiry
   */
  static async createEnquiry(data: IVehicleEnquiryCreateRequest): Promise<IVehicleEnquiry> {
    const enquiryData = {
      vehicle: data.vehicleId,
      customer: data.customer,
      enquiry: {
        ...data.enquiry,
        preferredDate: data.enquiry.preferredDate ? new Date(data.enquiry.preferredDate) : undefined
      },
      interests: {
        testDrive: data.interests?.testDrive || false,
        financing: data.interests?.financing || false,
        tradeIn: data.interests?.tradeIn || false,
        warranty: data.interests?.warranty || false
      },
      source: data.source || 'website'
    };

    const enquiry = new VehicleEnquiry(enquiryData);
    return await enquiry.save();
  }

  /**
   * Get all enquiries with filtering, sorting, and pagination
   */
  static async getEnquiries(query: IVehicleEnquiryQuery) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      vehicleId,
      dateFrom,
      dateTo,
      search
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (vehicleId) filter.vehicle = vehicleId;

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [enquiries, totalCount] = await Promise.all([
      VehicleEnquiry.find(filter)
        .populate({
          path: 'vehicle',
          select: 'internal.stockNumber make model year pricing.listPrice marketing.featured',
          populate: [
            {
              path: 'make',
              select: 'name slug'
            },
            {
              path: 'model',
              select: 'name slug'
            }
          ]
        })
        .populate('assignedTo', 'firstName lastName email')
        .populate('contactHistory.contactedBy', 'firstName lastName')
        .sort({ createdAt: -1, priority: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VehicleEnquiry.countDocuments(filter)
    ]);

    return {
      enquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get a single enquiry by ID
   */
  static async getEnquiryById(enquiryId: string): Promise<IVehicleEnquiry | null> {
    return await VehicleEnquiry.findById(enquiryId)
      .populate({
        path: 'vehicle',
        select: 'internal.stockNumber make model year pricing marketing.description images',
        populate: [
          {
            path: 'make',
            select: 'name slug logo'
          },
          {
            path: 'model',
            select: 'name slug'
          }
        ]
      })
      .populate('assignedTo', 'firstName lastName email profile.phone')
      .populate('contactHistory.contactedBy', 'firstName lastName')
      .lean();
  }

  /**
   * Update an enquiry
   */
  static async updateEnquiry(
    enquiryId: string, 
    updateData: IVehicleEnquiryUpdateRequest,
    updatedBy?: string
  ): Promise<IVehicleEnquiry | null> {
    const updateFields: any = { ...updateData };

    // If adding contact history, add the timestamp and user
    if (updateData.contactHistory && updatedBy) {
      const contactEntry = {
        ...updateData.contactHistory,
        date: new Date(),
        contactedBy: updatedBy
      };

      updateFields.$push = { contactHistory: contactEntry };
      delete updateFields.contactHistory;
    }

    return await VehicleEnquiry.findByIdAndUpdate(
      enquiryId,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'vehicle',
        select: 'internal.stockNumber make model year pricing',
        populate: [
          {
            path: 'make',
            select: 'name slug'
          },
          {
            path: 'model',
            select: 'name slug'
          }
        ]
      })
      .populate('assignedTo', 'firstName lastName email')
      .lean();
  }

  /**
   * Delete an enquiry
   */
  static async deleteEnquiry(enquiryId: string): Promise<boolean> {
    const result = await VehicleEnquiry.findByIdAndDelete(enquiryId);
    return !!result;
  }

  /**
   * Get enquiry statistics for admin dashboard
   */
  static async getEnquiryStats(): Promise<IVehicleEnquiryStats> {
    const [
      totalCount,
      statusStats,
      priorityStats,
      typeStats,
      avgResponseTimeResult
    ] = await Promise.all([
      // Total count
      VehicleEnquiry.countDocuments(),
      
      // Status breakdown
      VehicleEnquiry.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Priority breakdown
      VehicleEnquiry.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Type breakdown
      VehicleEnquiry.aggregate([
        {
          $group: {
            _id: '$enquiry.type',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Average response time calculation
      VehicleEnquiry.aggregate([
        {
          $match: {
            contactHistory: { $exists: true, $not: { $size: 0 } }
          }
        },
        {
          $addFields: {
            firstContact: { $arrayElemAt: ['$contactHistory', 0] },
            responseTime: {
              $divide: [
                { $subtract: [{ $arrayElemAt: ['$contactHistory.date', 0] }, '$createdAt'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ])
    ]);

    // Process results
    const byStatus = {
      new: 0,
      contacted: 0,
      inProgress: 0,
      completed: 0,
      closed: 0
    };

    statusStats.forEach((stat: any) => {
      if (stat._id === 'in-progress') byStatus.inProgress = stat.count;
      else byStatus[stat._id as keyof typeof byStatus] = stat.count;
    });

    const byPriority = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((stat: any) => {
      byPriority[stat._id as keyof typeof byPriority] = stat.count;
    });

    const byType = {
      general: 0,
      financing: 0,
      tradeIn: 0,
      testDrive: 0,
      priceNegotiation: 0
    };

    typeStats.forEach((stat: any) => {
      const key = stat._id.replace('-', '');
      if (key === 'tradein') byType.tradeIn = stat.count;
      else if (key === 'testdrive') byType.testDrive = stat.count;
      else if (key === 'pricenegotiation') byType.priceNegotiation = stat.count;
      else byType[key as keyof typeof byType] = stat.count;
    });

    return {
      total: totalCount,
      byStatus,
      byPriority,
      byType,
      avgResponseTime: avgResponseTimeResult[0]?.avgResponseTime || 0,
      conversionRate: byStatus.completed > 0 ? (byStatus.completed / totalCount) * 100 : 0
    };
  }

  /**
   * Get enquiries for a specific vehicle
   */
  static async getEnquiriesByVehicle(vehicleId: string) {
    return await VehicleEnquiry.find({ vehicle: vehicleId })
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Get enquiries assigned to a specific user
   */
  static async getEnquiriesByAssignee(userId: string) {
    return await VehicleEnquiry.find({ assignedTo: userId })
      .populate({
        path: 'vehicle',
        select: 'internal.stockNumber make model year',
        populate: [
          {
            path: 'make',
            select: 'name slug'
          },
          {
            path: 'model',
            select: 'name slug'
          }
        ]
      })
      .sort({ priority: 1, createdAt: -1 })
      .lean();
  }

  /**
   * Auto-assign enquiry to available admin
   */
  static async autoAssignEnquiry(enquiryId: string, availableAdmins: string[]) {
    if (availableAdmins.length === 0) return null;
    
    // Simple round-robin assignment - you can implement more sophisticated logic
    const randomIndex = Math.floor(Math.random() * availableAdmins.length);
    const selectedAdmin = availableAdmins[randomIndex];
    
    return await VehicleEnquiry.findByIdAndUpdate(
      enquiryId,
      { assignedTo: selectedAdmin },
      { new: true }
    );
  }
}
