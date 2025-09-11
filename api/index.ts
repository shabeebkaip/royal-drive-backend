import { VercelRequest, VercelResponse } from '@vercel/node';
import { App } from '../src/app';

let cachedApp: App | null = null;

const handler = async (req: VercelRequest, res: VercelResponse) => {
    try {
        // Basic environment validation for serverless
        if (!process.env.MONGODB_URI) {
            console.error('Missing MONGODB_URI environment variable');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                error: 'Missing required environment variables'
            });
        }

        // Initialize app instance if not cached
        if (!cachedApp) {
            console.log('Initializing new app instance for serverless...');
            cachedApp = new App(true); // Pass true to indicate serverless
            // Connect to database for serverless
            await cachedApp.connectDatabase();
            console.log('App instance initialized successfully');
        }

        // Handle the request
        return cachedApp.getApp()(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
        });
    }
};

export default handler;
