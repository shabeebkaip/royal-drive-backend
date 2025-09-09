# Royal Drive Backend - Clean Starter Pack

A modern, production-ready Node.js backend starter pack built with TypeScript, Express.js, and MongoDB.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **MongoDB & Mongoose** - NoSQL database with elegant ODM
- **Clean Architecture** - Organized folder structure with separation of concerns
- **Security** - Helmet, CORS, rate limiting built-in
- **Environment Configuration** - Comprehensive .env setup
- **Error Handling** - Global error handling with custom error classes
- **Logging** - Morgan HTTP request logger
- **Development Tools** - Nodemon, ESLint, Prettier, Vitest
- **JWT Ready** - JWT utilities included for future authentication
- **pnpm** - Fast, disk space efficient package manager

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd royal-drive-backend
```

2. **Install dependencies with pnpm**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Start development server**
```bash
pnpm dev
```

## 🔧 Scripts

- `pnpm dev` - Start development server with nodemon
- `pnpm dev:tsx` - Start development server with tsx watch
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm typecheck` - Type check without building

## 🌍 Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration (generate with: node -c "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── index.ts              # Application entry point
├── config/               # Configuration files
│   ├── database.ts       # MongoDB connection
│   └── env.ts           # Environment variables
├── controllers/          # Request handlers
│   └── ExampleController.ts
├── middleware/           # Custom middleware
│   ├── auth.ts          # Authentication middleware (template)
│   ├── errorHandler.ts  # Error handling
│   └── validation.ts    # Validation middleware
├── models/              # Mongoose models
│   └── Example.ts       # Example model
├── routes/              # API routes
│   └── index.ts         # Main routes
├── types/               # TypeScript type definitions
│   └── index.d.ts       # Global types
└── utils/               # Utility functions
    └── index.ts         # Common utilities and error classes
```

## 🛡️ Security Features

- **Helmet** - Sets various HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Express-validator and Zod ready
- **JWT Support** - Ready for authentication implementation

## 🗄️ Database

The starter pack uses MongoDB with Mongoose. The connection is configured with:
- Connection pooling
- Automatic reconnection
- Graceful shutdown handling
- Error event handling

## 🚨 Error Handling

Comprehensive error handling with custom error classes:
- `AppError` - Base error class
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `NotFoundError` - 404 errors

## 📝 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Server health check
- `GET /api/v1/health` - API health check
- `GET /api/v1/info` - API information

## 🧪 Development

### Adding New Features

1. **Create a Model** (if needed)
```typescript
// src/models/YourModel.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IYourModel extends Document {
  name: string;
  // ... other fields
}

const YourModelSchema = new Schema<IYourModel>({
  name: { type: String, required: true }
});

export const YourModel = mongoose.model<IYourModel>('YourModel', YourModelSchema);
```

2. **Create a Controller**
```typescript
// src/controllers/YourController.ts
import { Request, Response } from 'express';
import { createApiResponse } from '../utils/index.js';

export class YourController {
  static async yourMethod(req: Request, res: Response): Promise<void> {
    // Your logic here
  }
}
```

3. **Add Routes**
```typescript
// src/routes/yourRoutes.ts
import express from 'express';
import { YourController } from '../controllers/YourController.js';

const router = express.Router();
router.get('/your-endpoint', YourController.yourMethod);
export { router as yourRoutes };
```

### Port Conflicts

If you encounter `EADDRINUSE` errors:

1. **Find processes using the port:**
```bash
lsof -ti:3001
```

2. **Kill the processes:**
```bash
lsof -ti:3001 | xargs kill -9
```

3. **Or change the port in `.env`:**
```env
PORT=3002
```

## 🔐 JWT Secret Generation

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📋 TODO / Next Steps

- [ ] Add authentication routes
- [ ] Implement user management
- [ ] Add API documentation (Swagger)
- [ ] Set up testing framework
- [ ] Add Docker configuration
- [ ] Set up CI/CD pipeline

## 📄 License

MIT License - see LICENSE file for details.

## 👤 Author

**Shabeeb**

---

**Happy coding! 🎉**

This starter pack gives you a solid foundation to build your Node.js backend application with modern best practices and tools.
