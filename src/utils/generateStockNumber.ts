/**
 * Utility function for generating unique stock numbers for vehicles
 */

/**
 * Generate a unique stock number
 * Format: RD-YYYY-XXXXXX (RD = Royal Drive, YYYY = year, XXXXXX = 6-digit sequential number)
 * @returns Promise<string> The generated stock number
 */
export async function generateStockNumber(): Promise<string> {
  const { Vehicle } = await import('../models/vehicle.js');
  
  const currentYear = new Date().getFullYear();
  const prefix = `RD-${currentYear}-`;
  
  // Find the highest stock number for the current year
  const lastVehicle = await Vehicle
    .findOne({
      'internal.stockNumber': { $regex: `^${prefix}` }
    })
    .sort({ 'internal.stockNumber': -1 })
    .select('internal.stockNumber')
    .exec();

  let sequenceNumber = 1;
  
  if (lastVehicle) {
    // Extract the sequence number from the last stock number
    const lastStockNumber = lastVehicle.internal.stockNumber;
    const match = lastStockNumber.match(/RD-\d{4}-(\d{6})$/);
    if (match) {
      sequenceNumber = parseInt(match[1]) + 1;
    }
  }
  
  // Format sequence number with leading zeros (6 digits)
  const formattedSequence = sequenceNumber.toString().padStart(6, '0');
  
  return `${prefix}${formattedSequence}`;
}

/**
 * Check if a stock number is available (not already used)
 * @param stockNumber The stock number to check
 * @returns Promise<boolean> True if available, false if already exists
 */
export async function isStockNumberAvailable(stockNumber: string): Promise<boolean> {
  const { Vehicle } = await import('../models/vehicle.js');
  
  const existingVehicle = await Vehicle
    .findOne({ 'internal.stockNumber': stockNumber })
    .select('_id')
    .exec();
    
  return !existingVehicle;
}
