import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import {env, isDevelopment} from './config/env.js';
import {database} from './config/database.js';
import {apiRoutes} from './routes/index.js';
import {errorHandler, notFoundHandler} from './middleware/errorHandler.js';

export class App {
    public app: express.Application;
    private isServerless: boolean;

    constructor(isServerless: boolean = false) {
        this.app = express();
        this.isServerless = isServerless || process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private initializeMiddleware(): void {
        // Security middleware
        this.app.use(helmet({
            crossOriginEmbedderPolicy: false
        }));

        // CORS configuration
        this.app.use(cors({
            origin: (origin, callback) => {
                // Allow requests with no origin (mobile apps, desktop apps, Postman, etc.)
                if (!origin) return callback(null, true);
                
                const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(url => url.trim());
                
                // Allow Vercel preview and production domains
                const isVercelDomain = origin.includes('.vercel.app');
                
                if (allowedOrigins.includes(origin) || isVercelDomain) {
                    return callback(null, true);
                }
                
                return callback(new Error('Not allowed by CORS'), false);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));

        // Body parsing
        this.app.use(express.json({limit: '10mb'}));
        this.app.use(express.urlencoded({extended: true, limit: '10mb'}));

        // Compression
        this.app.use(compression());

        // Rate limiting (only for non-serverless)
        if (!this.isServerless) {
            const limiter = rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100, // limit each IP to 100 requests per windowMs
                message: {
                    error: 'Too many requests from this IP, please try again later.'
                }
            });
            this.app.use('/api/', limiter);
        }

        // Logging (only in development)
        if (isDevelopment && !this.isServerless) {
            this.app.use(morgan('dev'));
        }
    }

    private initializeRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                message: 'Royal Drive Backend is running!',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV
            });
        });

        // API routes
        this.app.use('/api/v1', apiRoutes);

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.status(200).json({
                message: 'Welcome to Royal Drive Backend!',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });
    }

    private initializeErrorHandling(): void {
        // 404 handler
        this.app.use(notFoundHandler);

        // Global error handler
        this.app.use(errorHandler);
    }

    public async connectDatabase(): Promise<void> {
        try {
            await database.connect();
            console.log('✅ Database connected for serverless function');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    public async start(): Promise<void> {
        try {
            // Connect to database
            await database.connect();

            // Start server (only for non-serverless)
            if (!this.isServerless) {
                this.app.listen(env.PORT, () => {
                    console.log(`🚀 Server running on port ${env.PORT}`);
                    console.log(`📱 Environment: ${env.NODE_ENV}`);
                    console.log(`🔗 API Base URL: http://localhost:${env.PORT}/api/v1`);
                    console.log(`❤️  Health Check: http://localhost:${env.PORT}/health`);
                    console.log(`📋 Clean starter pack ready for development!`);
                });
            }

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            if (!this.isServerless) {
                process.exit(1);
            }
        }
    }
}

export default App;
