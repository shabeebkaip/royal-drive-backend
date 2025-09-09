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

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        // Security middleware
        this.app.use(helmet({
            crossOriginResourcePolicy: {policy: "cross-origin"}
        }));

        // CORS configuration
        this.app.use(cors({
            origin: env.ALLOWED_ORIGINS.split(','),
            credentials: true,
            optionsSuccessStatus: 200,
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: env.RATE_LIMIT_WINDOW_MS,
            max: env.RATE_LIMIT_MAX_REQUESTS,
            message: {
                success: false,
                message: 'Too many requests from this IP, please try again later.',
                timestamp: new Date().toISOString(),
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use(limiter);

        // Compression middleware
        this.app.use(compression());

        // Body parsing middleware
        this.app.use(express.json({limit: '10mb'}));
        this.app.use(express.urlencoded({extended: true, limit: '10mb'}));

        // Logging middleware
        if (isDevelopment) {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(morgan('combined'));
        }

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV,
                version: '1.0.0',
            });
        });
    }

    private initializeRoutes(): void {
        // API routes
        this.app.use('/api/v1', apiRoutes);

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Welcome to Royal Drive Backend API - Clean Starter Pack',
                version: '1.0.0',
                documentation: '/api/v1/info',
                endpoints: [
                    'GET / - Welcome message',
                    'GET /health - Health check',
                    'GET /api/v1/health - API health check',
                    'GET /api/v1/info - API information',
                ],
                timestamp: new Date().toISOString(),
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

            // Start server
            this.app.listen(env.PORT, () => {
                console.log(`🚀 Server running on port ${env.PORT}`);
                console.log(`📱 Environment: ${env.NODE_ENV}`);
                console.log(`🔗 API Base URL: http://localhost:${env.PORT}/api/v1`);
                console.log(`❤️  Health Check: http://localhost:${env.PORT}/health`);
                console.log(`📋 Clean starter pack ready for development!`);
            });

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }
}

export default App;
