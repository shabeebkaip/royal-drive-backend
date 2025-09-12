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
import {getAvailablePort} from './utils/portUtils.js';

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
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
                
                if (allowedOrigins.includes(origin)) {
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

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.'
            }
        });
        this.app.use('/api/', limiter);

        // Logging (only in development)
        if (isDevelopment) {
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

    public async start(): Promise<void> {
        try {
            // Connect to database
            await database.connect();

            // Find available port
            const availablePort = await getAvailablePort(env.PORT);

            // Start server
            this.app.listen(availablePort, () => {
                console.log(`🚀 Server running on port ${availablePort}`);
                console.log(`📱 Environment: ${env.NODE_ENV}`);
                console.log(`🔗 API Base URL: http://localhost:${availablePort}/api/v1`);
                console.log(`❤️  Health Check: http://localhost:${availablePort}/health`);
                console.log(`📋 Clean starter pack ready for development!`);
                
                // Show port info if different from preferred
                if (availablePort !== env.PORT) {
                    console.log(`💡 Preferred port ${env.PORT} was in use, automatically switched to ${availablePort}`);
                }
            });

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }
}

export default App;
