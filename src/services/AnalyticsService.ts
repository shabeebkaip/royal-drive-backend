import { Vehicle } from '../models/vehicle.js';
import { VehicleEnquiry } from '../models/VehicleEnquiry.js';
import { CarSubmission } from '../models/CarSubmission.js';
import { ContactEnquiry } from '../models/ContactEnquiry.js';
import { User } from '../models/User.js';
import { SalesTransaction } from '../models/SalesTransaction.js';
import { Make } from '../models/make.js';
import { env } from '../config/env.js';
import { createClient, RedisClientType } from 'redis';

// Lazy Redis client (optional)
let redisClient: RedisClientType | null = null;
async function getRedis() {
  if (!env.REDIS_URL) return null;
  if (redisClient) return redisClient;
  redisClient = createClient({ url: env.REDIS_URL });
  redisClient.on('error', (err: any) => console.warn('Redis error:', err?.message));
  if (!redisClient.isOpen) await redisClient.connect();
  return redisClient;
}

export class AnalyticsService {
  /**
   * Get high-level dashboard KPIs and trend data.
   * period: last_7_days | last_30_days | last_90_days | ytd | all_time | custom (with dateFrom/dateTo)
   */
  static async getDashboardOverview(params: { period?: string; dateFrom?: string; dateTo?: string }) {
    const { period = 'last_30_days', dateFrom, dateTo } = params;
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'last_7_days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case 'last_30_days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
      case 'last_90_days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
      case 'ytd':
        start = new Date(now.getFullYear(), 0, 1); break;
      case 'all_time':
        start = new Date(0); break; // Unix epoch (January 1, 1970)
      case 'custom':
        start = dateFrom ? new Date(dateFrom) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    const end = dateTo ? new Date(dateTo) : now;

    // Parallel counts
    const [
      totalVehicles,
      newVehiclesPeriod,
      vehicleEnquiriesPeriod,
      carSubmissionsPeriod,
      contactEnquiriesPeriod,
      usersActive,
      vehiclesByStatus,
      vehicleEnquiriesByStatus,
      carSubmissionsByStatus,
      contactEnquiriesByStatus,
      avgDaysInInventoryAgg,
      topMakes,
      salesPeriodAgg,
      salesPrevPeriodAgg,
      marginAgg
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      VehicleEnquiry.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      CarSubmission.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      ContactEnquiry.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      User.countDocuments({ status: 'active' }),
      Vehicle.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      VehicleEnquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      CarSubmission.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      ContactEnquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Vehicle.aggregate([
        { $match: { 'internal.acquisitionDate': { $exists: true } } },
        { $project: { days: { $divide: [ { $subtract: [ new Date(), '$internal.acquisitionDate' ] }, 1000 * 60 * 60 * 24 ] } } },
        { $group: { _id: null, avgDays: { $avg: '$days' } } }
      ]),
      Vehicle.aggregate([
        { $group: { _id: '$make', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      // Sales in period
      SalesTransaction.aggregate([
        { $match: { status: 'completed', closedAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, revenue: { $sum: '$salePrice' }, count: { $sum: 1 } } }
      ]),
      // Previous equivalent period for growth
      (async () => {
        const duration = end.getTime() - start.getTime();
        const prevEnd = new Date(start.getTime());
        const prevStart = new Date(start.getTime() - duration);
        return SalesTransaction.aggregate([
          { $match: { status: 'completed', closedAt: { $gte: prevStart, $lt: prevEnd } } },
          { $group: { _id: null, revenue: { $sum: '$salePrice' }, count: { $sum: 1 } } }
        ]);
      })(),
      // Margin aggregation
      SalesTransaction.aggregate([
        { $match: { status: 'completed', closedAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, totalMargin: { $sum: '$margin' }, avgMargin: { $avg: '$margin' } } }
      ])
    ]);

  // Daily trend (vehicles + all enquiry types + submissions + sales)
  // Try cache (include version tag for structure changes)
  const cacheKey = `analytics:trend:v3:${start.toISOString()}:${end.toISOString()}`;
    let trend: any[] | null = null;
    const redis = await getRedis();
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) trend = JSON.parse(cached);
    }
    if (!trend) {
      trend = await AnalyticsService.buildDailyTrend(start, end);
      if (redis) await redis.set(cacheKey, JSON.stringify(trend), { EX: env.REDIS_TTL_SECONDS });
    }

    // Smooth trend (simple 3-point moving average)
  const smoothed = trend.map((point, idx) => {
      const window = trend.slice(Math.max(0, idx - 1), Math.min(trend.length, idx + 2));
      const avg = (arr: any[], key: string) => arr.reduce((s, p) => s + p[key], 0) / arr.length;
      return {
        ...point,
        vehiclesSmoothed: Number(avg(window, 'vehicles').toFixed(2)),
        vehicleEnquiriesSmoothed: Number(avg(window, 'vehicleEnquiries').toFixed(2)),
        carSubmissionsSmoothed: Number(avg(window, 'carSubmissions').toFixed(2)),
        contactEnquiriesSmoothed: Number(avg(window, 'contactEnquiries').toFixed(2)),
        salesSmoothed: Number(avg(window, 'sales').toFixed(2)),
        salesRevenueSmoothed: Number(avg(window, 'salesRevenue').toFixed(2))
      };
    });

    const avgDaysInInventory = avgDaysInInventoryAgg[0]?.avgDays || 0;

    const statusMap = (arr: any[]) => arr.reduce((acc, cur) => { acc[cur._id || 'unknown'] = cur.count; return acc; }, {} as Record<string, number>);

    // Resolve make IDs
    const makeIds = topMakes.map(m => m._id).filter(Boolean);
    const makes = await Make.find({ _id: { $in: makeIds } }).select('name slug');
    const makeMap = new Map(makes.map(m => [String(m._id), { name: m.name, slug: m.slug }]));
    const topMakesResolved = topMakes.map(m => ({
      makeId: m._id,
      count: m.count,
      name: makeMap.get(String(m._id))?.name || 'Unknown',
      slug: makeMap.get(String(m._id))?.slug
    }));

    const revenue = salesPeriodAgg[0]?.revenue || 0;
    const salesCount = salesPeriodAgg[0]?.count || 0;
    const prevRevenue = salesPrevPeriodAgg[0]?.revenue || 0;
    const prevSales = salesPrevPeriodAgg[0]?.count || 0;
    const revenueGrowth = prevRevenue ? ((revenue - prevRevenue) / prevRevenue) * 100 : (revenue ? 100 : 0);
    const salesGrowth = prevSales ? ((salesCount - prevSales) / prevSales) * 100 : (salesCount ? 100 : 0);
    const totalMargin = marginAgg[0]?.totalMargin || 0;
    const avgMargin = marginAgg[0]?.avgMargin || 0;

    return {
      period: { start, end },
      kpis: {
        totalVehicles,
        newVehicles: newVehiclesPeriod,
        vehicleEnquiries: vehicleEnquiriesPeriod,
        carSubmissions: carSubmissionsPeriod,
        contactEnquiries: contactEnquiriesPeriod,
        activeUsers: usersActive,
        avgDaysInInventory: Number(avgDaysInInventory.toFixed(1)),
        revenue,
        revenueGrowth: Number(revenueGrowth.toFixed(2)),
        salesCount,
        salesGrowth: Number(salesGrowth.toFixed(2)),
        totalMargin: Number(totalMargin.toFixed(2)),
        avgMargin: Number(avgMargin.toFixed(2))
      },
      breakdown: {
        vehiclesByStatus: statusMap(vehiclesByStatus),
        vehicleEnquiriesByStatus: statusMap(vehicleEnquiriesByStatus),
        carSubmissionsByStatus: statusMap(carSubmissionsByStatus),
        contactEnquiriesByStatus: statusMap(contactEnquiriesByStatus)
      },
      topMakes: topMakesResolved,
      trend,
      trendSmoothed: smoothed,
      meta: {
        cached: !!(await getRedis()) && !!(await (async () => { const r = await getRedis(); if(!r) return false; const c = await r.ttl(cacheKey); return c > -1; })())
      }
    };
  }

  /** Build daily trend combining counts for vehicles, vehicle enquiries, car submissions, contact enquiries, and sales */
  private static async buildDailyTrend(start: Date, end: Date) {
    const pipeline: any[] = [
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 as 1 } }
    ];
    const salesPipeline: any[] = [
      { $match: { status: 'completed', closedAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$closedAt' } }, count: { $sum: 1 }, revenue: { $sum: '$salePrice' } } },
      { $sort: { _id: 1 as 1 } }
    ];

    const [vehicleTrend, vehicleEnquiryTrend, carSubmissionTrend, contactEnquiryTrend, salesTrend] = await Promise.all([
      Vehicle.aggregate(pipeline),
      VehicleEnquiry.aggregate(pipeline),
      CarSubmission.aggregate(pipeline),
      ContactEnquiry.aggregate(pipeline),
      SalesTransaction.aggregate(salesPipeline)
    ]);

    // Merge dates
    const dateSet = new Set<string>();
    [vehicleTrend, vehicleEnquiryTrend, carSubmissionTrend, contactEnquiryTrend, salesTrend].forEach(arr => arr.forEach(r => dateSet.add(r._id)));
    const dates = Array.from(dateSet).sort();

    return dates.map(d => ({
      date: d,
      vehicles: vehicleTrend.find(r => r._id === d)?.count || 0,
      vehicleEnquiries: vehicleEnquiryTrend.find(r => r._id === d)?.count || 0,
      carSubmissions: carSubmissionTrend.find(r => r._id === d)?.count || 0,
      contactEnquiries: contactEnquiryTrend.find(r => r._id === d)?.count || 0,
      sales: salesTrend.find(r => r._id === d)?.count || 0,
      salesRevenue: salesTrend.find(r => r._id === d)?.revenue || 0
    }));
  }
}
