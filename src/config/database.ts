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
      const mongooseOptions = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Try to select a server for up to 5 seconds per attempt
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        // Recommended for Atlas/MongoDB SRV
        family: 4, // Force IPv4 to avoid IPv6 DNS issues on some networks
        directConnection: false,
      } as const;

      const maxRetries = env.DB_CONNECT_MAX_RETRIES;
      const retryDelay = env.DB_CONNECT_RETRY_MS;

      let attempt = 0;
      // Retry loop for transient DNS/whitelist timing issues
      // This keeps the process alive (nodemon) while you add your IP to the Atlas access list.
      while (true) {
        try {
          attempt += 1;
          await mongoose.connect(env.MONGODB_URI, mongooseOptions);
          console.log('🎉 MongoDB connected successfully');

          // Handle connection events
          mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
          });

          mongoose.connection.on('disconnected', () => {
            console.log('📡 MongoDB disconnected');
          });

          mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
          });

          // Graceful shutdown
          process.on('SIGINT', async () => {
            await this.disconnect();
            process.exit(0);
          });

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
