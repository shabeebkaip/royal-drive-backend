import { CarSubmission, ICarSubmission } from '../models/CarSubmission';
import { 
  ICarSubmissionCreateRequest, 
  ICarSubmissionUpdateRequest, 
  ICarSubmissionQuery,
  ICarSubmissionStats 
} from '../types/carSubmission.d';

export class CarSubmissionService {
  
  /**
   * Create a new car submission
   */
  static async createSubmission(data: ICarSubmissionCreateRequest): Promise<ICarSubmission> {
    const submissionData: any = {
      vehicle: data.vehicle,
      pricing: {
        ...data.pricing,
        currency: 'CAD'
      },
      owner: data.owner,
      history: data.history,
      features: data.features,
      media: {
        images: data.images || [],
        documents: []
      },
      source: data.source || 'website'
    };

    const submission = new CarSubmission(submissionData);
    return await submission.save();
  }

  /**
   * Get all submissions with filtering, sorting, and pagination
   */
  static async getSubmissions(query: ICarSubmissionQuery) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      make,
      model,
      year,
      minPrice,
      maxPrice,
      condition,
      dateFrom,
      dateTo,
      search
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (make) filter['vehicle.make'] = new RegExp(make, 'i');
    if (model) filter['vehicle.model'] = new RegExp(model, 'i');
    if (year) filter['vehicle.year'] = parseInt(year);
    if (condition) filter['vehicle.condition'] = condition;

    // Price range filter
    if (minPrice || maxPrice) {
      filter['pricing.expectedPrice'] = {};
      if (minPrice) filter['pricing.expectedPrice'].$gte = minPrice;
      if (maxPrice) filter['pricing.expectedPrice'].$lte = maxPrice;
    }

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

    const [submissions, totalCount] = await Promise.all([
      CarSubmission.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .populate('contactHistory.contactedBy', 'firstName lastName')
        .populate('evaluation.evaluatedBy', 'firstName lastName')
        .populate('inspection.inspector', 'firstName lastName')
        .populate('offer.madeBy', 'firstName lastName')
        .sort({ createdAt: -1, priority: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CarSubmission.countDocuments(filter)
    ]);

    return {
      submissions,
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
   * Get a single submission by ID
   */
  static async getSubmissionById(submissionId: string): Promise<ICarSubmission | null> {
    return await CarSubmission.findById(submissionId)
      .populate('assignedTo', 'firstName lastName email profile.phone')
      .populate('contactHistory.contactedBy', 'firstName lastName')
      .populate('evaluation.evaluatedBy', 'firstName lastName profile.phone')
      .populate('inspection.inspector', 'firstName lastName profile.phone')
      .populate('offer.madeBy', 'firstName lastName')
      .lean();
  }

  /**
   * Update a submission
   */
  static async updateSubmission(
    submissionId: string, 
    updateData: ICarSubmissionUpdateRequest,
    updatedBy?: string
  ): Promise<ICarSubmission | null> {
    const updateFields: any = { ...updateData };

    // Handle evaluation update
    if (updateData.evaluation && updatedBy) {
      updateFields.evaluation = {
        ...updateData.evaluation,
        evaluatedBy: updatedBy,
        evaluatedAt: new Date()
      };
    }

    // Handle offer update
    if (updateData.offer && updatedBy) {
      updateFields.offer = {
        ...updateData.offer,
        madeBy: updatedBy,
        madeAt: new Date()
      };
      
      // Convert validUntil string to Date if provided
      if (updateData.offer.validUntil) {
        updateFields.offer.validUntil = new Date(updateData.offer.validUntil);
      }
    }

    // Handle inspection update
    if (updateData.inspection) {
      updateFields.inspection = { ...updateData.inspection };
      
      // Convert date strings to Date objects
      if (updateData.inspection.scheduledDate) {
        updateFields.inspection.scheduledDate = new Date(updateData.inspection.scheduledDate);
      }
      if (updateData.inspection.completedDate) {
        updateFields.inspection.completedDate = new Date(updateData.inspection.completedDate);
      }
    }

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

    return await CarSubmission.findByIdAndUpdate(
      submissionId,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'firstName lastName email')
      .populate('evaluation.evaluatedBy', 'firstName lastName')
      .populate('offer.madeBy', 'firstName lastName')
      .lean();
  }

  /**
   * Delete a submission
   */
  static async deleteSubmission(submissionId: string): Promise<boolean> {
    const result = await CarSubmission.findByIdAndDelete(submissionId);
    return !!result;
  }

  /**
   * Get submission statistics for admin dashboard
   */
  static async getSubmissionStats(): Promise<ICarSubmissionStats> {
    const [
      totalCount,
      statusStats,
      priorityStats,
      conditionStats,
      avgPriceResult,
      avgOfferResult
    ] = await Promise.all([
      // Total count
      CarSubmission.countDocuments(),
      
      // Status breakdown
      CarSubmission.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Priority breakdown
      CarSubmission.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Condition breakdown
      CarSubmission.aggregate([
        {
          $group: {
            _id: '$vehicle.condition',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Average expected price
      CarSubmission.aggregate([
        {
          $group: {
            _id: null,
            avgPrice: { $avg: '$pricing.expectedPrice' }
          }
        }
      ]),
      
      // Average offer amount
      CarSubmission.aggregate([
        {
          $match: {
            'offer.amount': { $exists: true, $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgOffer: { $avg: '$offer.amount' }
          }
        }
      ])
    ]);

    // Process results
    const byStatus = {
      new: 0,
      reviewing: 0,
      contacted: 0,
      scheduledInspection: 0,
      inspected: 0,
      offerMade: 0,
      negotiating: 0,
      accepted: 0,
      rejected: 0,
      completed: 0
    };

    statusStats.forEach((stat: any) => {
      const key = stat._id.replace('-', '');
      if (key === 'scheduledinspection') byStatus.scheduledInspection = stat.count;
      else if (key === 'offermade') byStatus.offerMade = stat.count;
      else byStatus[key as keyof typeof byStatus] = stat.count;
    });

    const byPriority = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((stat: any) => {
      byPriority[stat._id as keyof typeof byPriority] = stat.count;
    });

    const byCondition = { excellent: 0, good: 0, fair: 0, poor: 0 };
    conditionStats.forEach((stat: any) => {
      byCondition[stat._id as keyof typeof byCondition] = stat.count;
    });

    return {
      total: totalCount,
      byStatus,
      byPriority,
      byCondition,
      avgExpectedPrice: avgPriceResult[0]?.avgPrice || 0,
      avgOfferAmount: avgOfferResult[0]?.avgOffer || 0,
      conversionRate: byStatus.accepted > 0 ? (byStatus.accepted / totalCount) * 100 : 0,
      avgProcessingTime: 0 // This would require more complex calculation
    };
  }

  /**
   * Get submissions assigned to a specific user
   */
  static async getSubmissionsByAssignee(userId: string) {
    return await CarSubmission.find({ assignedTo: userId })
      .sort({ priority: 1, createdAt: -1 })
      .lean();
  }

  /**
   * Get submissions by make/model
   */
  static async getSubmissionsByMakeModel(make?: string, model?: string) {
    const filter: any = {};
    if (make) filter['vehicle.make'] = new RegExp(make, 'i');
    if (model) filter['vehicle.model'] = new RegExp(model, 'i');
    
    return await CarSubmission.find(filter)
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Auto-assign submission to available admin
   */
  static async autoAssignSubmission(submissionId: string, availableAdmins: string[]) {
    if (availableAdmins.length === 0) return null;
    
    // Simple round-robin assignment
    const randomIndex = Math.floor(Math.random() * availableAdmins.length);
    const selectedAdmin = availableAdmins[randomIndex];
    
    return await CarSubmission.findByIdAndUpdate(
      submissionId,
      { assignedTo: selectedAdmin },
      { new: true }
    );
  }

  /**
   * Get submissions needing attention (high priority, old submissions, etc.)
   */
  static async getSubmissionsNeedingAttention() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await CarSubmission.find({
      $or: [
        { priority: 'high', status: 'new' },
        { createdAt: { $lte: threeDaysAgo }, status: 'new' },
        { status: 'scheduled-inspection', 'inspection.scheduledDate': { $lte: new Date() } }
      ]
    })
      .populate('assignedTo', 'firstName lastName')
      .sort({ priority: 1, createdAt: -1 })
      .lean();
  }

  /**
   * Search submissions by owner information
   */
  static async searchByOwner(searchTerm: string) {
    return await CarSubmission.find({
      $or: [
        { 'owner.firstName': new RegExp(searchTerm, 'i') },
        { 'owner.lastName': new RegExp(searchTerm, 'i') },
        { 'owner.email': new RegExp(searchTerm, 'i') },
        { 'owner.phone': new RegExp(searchTerm, 'i') }
      ]
    })
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
  }
}
