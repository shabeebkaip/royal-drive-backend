import mongoose from 'mongoose';
import { env } from './env.js';

class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      // In serverless environments, check if already connected to avoid connection churn
      if (mongoose.connection.readyState === 1) {
        console.log('✅ Database already connected (using existing connection)');
        return;
      }

      const mongooseOptions = {
        maxPoolSize: process.env.VERCEL ? 5 : 10, // Smaller pool for serverless
        serverSelectionTimeoutMS: process.env.VERCEL ? 3000 : 5000, // Faster timeout for serverless
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        // Recommended for Atlas/MongoDB SRV
        family: 4, // Force IPv4 to avoid IPv6 DNS issues on some networks
        directConnection: false,
      } as const;

      const maxRetries = process.env.VERCEL ? 2 : env.DB_CONNECT_MAX_RETRIES; // Fewer retries for serverless
      const retryDelay = env.DB_CONNECT_RETRY_MS;

      let attempt = 0;
      // Retry loop for transient DNS/whitelist timing issues
      // This keeps the process alive (nodemon) while you add your IP to the Atlas access list.
      while (true) {
        try {
          attempt += 1;
          await mongoose.connect(env.MONGODB_URI, mongooseOptions);
          console.log('🎉 MongoDB connected successfully');

          // Handle connection events (only add listeners once)
          if (mongoose.connection.listenerCount('error') === 0) {
            mongoose.connection.on('error', (error) => {
              console.error('❌ MongoDB connection error:', error);
            });

            mongoose.connection.on('disconnected', () => {
              console.log('📡 MongoDB disconnected');
            });

            mongoose.connection.on('reconnected', () => {
              console.log('🔄 MongoDB reconnected');
            });

            // Graceful shutdown (only for non-serverless)
            if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
              process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
              });
            }
          }

          return; // success
        } catch (err) {
          const e = err as Error;
          const isServerSelection = e.name === 'MongooseServerSelectionError' || /server selection/i.test(e.message);
          const isWhitelist = /whitelist|not whitelisted|ip address/i.test(e.message);
          const isDns = /ENOTFOUND|EAI_AGAIN|dns/i.test(e.message);

          console.error(`❌ MongoDB connection attempt ${attempt} failed:`, e.message);

          if (attempt >= maxRetries && !(isServerSelection || isWhitelist || isDns)) {
            // Non-transient or unknown after retries: exit
            throw err;
          }

          if (attempt >= maxRetries) {
            console.error(`Reached max retries (${maxRetries}). Still cannot connect.`);
            throw err;
          }

          console.log(`⏳ Retrying MongoDB connection in ${retryDelay}ms...`);
          await new Promise((r) => setTimeout(r, retryDelay));
        }
      }

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      // In serverless, throw the error instead of exiting process
      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        throw error;
      }
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log('👋 MongoDB connection closed');
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
    }
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const database = DatabaseConnection.getInstance();
