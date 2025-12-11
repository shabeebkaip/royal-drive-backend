import { ContactEnquiry } from '../models/ContactEnquiry.js';
import type { 
  IContactEnquiry,
  IContactEnquiryCreateRequest, 
  IContactEnquiryUpdateRequest, 
  IContactEnquiryQuery 
} from '../types/contactEnquiry.d.js';
import mongoose from 'mongoose';

export class ContactEnquiryService {
  
  /**
   * Create a new contact enquiry (Public endpoint)
   */
  static async createEnquiry(data: IContactEnquiryCreateRequest): Promise<IContactEnquiry> {
    const enquiry = new ContactEnquiry({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      source: data.source || 'website',
      status: 'new',
      priority: 'medium'
    });

    return await enquiry.save();
  }

  /**
   * Get all contact enquiries with filtering, sorting, and pagination (Admin only)
   */
  static async getEnquiries(query: IContactEnquiryQuery) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      subject,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (subject) filter.subject = subject;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Text search across multiple fields
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [enquiries, totalCount] = await Promise.all([
      ContactEnquiry.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .populate('notes.createdBy', 'firstName lastName')
        .populate('contactHistory.contactedBy', 'firstName lastName')
        .populate('resolvedBy', 'firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactEnquiry.countDocuments(filter)
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
   * Get a single enquiry by ID (Admin only)
   */
  static async getEnquiryById(enquiryId: string): Promise<IContactEnquiry | null> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throw new Error('Invalid enquiry ID');
    }

    return await ContactEnquiry.findById(enquiryId)
      .populate('assignedTo', 'firstName lastName email profile.phone')
      .populate('notes.createdBy', 'firstName lastName')
      .populate('contactHistory.contactedBy', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .lean();
  }

  /**
   * Update an enquiry (Admin only)
   */
  static async updateEnquiry(
    enquiryId: string, 
    updateData: IContactEnquiryUpdateRequest,
    updatedBy?: string
  ): Promise<IContactEnquiry | null> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throw new Error('Invalid enquiry ID');
    }

    const enquiry = await ContactEnquiry.findById(enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }

    // Update basic fields
    if (updateData.status) enquiry.status = updateData.status;
    if (updateData.priority) enquiry.priority = updateData.priority;
    if (updateData.assignedTo) enquiry.assignedTo = updateData.assignedTo as any;

    // Add note if provided
    if (updateData.notes && updatedBy) {
      enquiry.notes.push({
        content: updateData.notes.content,
        createdBy: updatedBy as any,
        createdAt: new Date()
      });
    }

    // Add contact history if provided
    if (updateData.contactHistory && updatedBy) {
      enquiry.contactHistory.push({
        date: new Date(),
        method: updateData.contactHistory.method,
        notes: updateData.contactHistory.notes,
        contactedBy: updatedBy as any
      });
    }

    // Auto-resolve if status is resolved
    if (updateData.status === 'resolved' && updatedBy) {
      enquiry.resolvedAt = new Date();
      enquiry.resolvedBy = updatedBy as any;
    }

    await enquiry.save();

    return await ContactEnquiry.findById(enquiryId)
      .populate('assignedTo', 'firstName lastName email')
      .populate('notes.createdBy', 'firstName lastName')
      .populate('contactHistory.contactedBy', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .lean();
  }

  /**
   * Delete an enquiry (Admin only)
   */
  static async deleteEnquiry(enquiryId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      throw new Error('Invalid enquiry ID');
    }

    const result = await ContactEnquiry.findByIdAndDelete(enquiryId);
    return !!result;
  }

  /**
   * Get enquiry statistics (Admin only)
   */
  static async getStats() {
    const [
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      resolvedEnquiries,
      bySubject,
      byPriority,
      recentEnquiries
    ] = await Promise.all([
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'new' }),
      ContactEnquiry.countDocuments({ status: 'in-progress' }),
      ContactEnquiry.countDocuments({ status: 'resolved' }),
      ContactEnquiry.aggregate([
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      ContactEnquiry.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      ContactEnquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email subject status createdAt')
        .lean()
    ]);

    return {
      total: totalEnquiries,
      byStatus: {
        new: newEnquiries,
        inProgress: inProgressEnquiries,
        resolved: resolvedEnquiries
      },
      bySubject,
      byPriority,
      recentEnquiries
    };
  }

  /**
   * Assign enquiry to admin user (Admin only)
   */
  static async assignEnquiry(enquiryId: string, adminUserId: string): Promise<IContactEnquiry | null> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId) || !mongoose.Types.ObjectId.isValid(adminUserId)) {
      throw new Error('Invalid ID');
    }

    return await ContactEnquiry.findByIdAndUpdate(
      enquiryId,
      { assignedTo: adminUserId },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'firstName lastName email')
      .lean();
  }

  /**
   * Add note to enquiry (Admin only)
   */
  static async addNote(enquiryId: string, content: string, userId: string): Promise<IContactEnquiry | null> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ID');
    }

    const enquiry = await ContactEnquiry.findById(enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }

    await enquiry.addNote(content, userId as any);

    return await ContactEnquiry.findById(enquiryId)
      .populate('notes.createdBy', 'firstName lastName')
      .lean();
  }

  /**
   * Mark enquiry as resolved (Admin only)
   */
  static async markAsResolved(enquiryId: string, userId: string): Promise<IContactEnquiry | null> {
    if (!mongoose.Types.ObjectId.isValid(enquiryId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ID');
    }

    const enquiry = await ContactEnquiry.findById(enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }

    await enquiry.markAsResolved(userId as any);

    return await ContactEnquiry.findById(enquiryId)
      .populate('resolvedBy', 'firstName lastName')
      .lean();
  }
}
