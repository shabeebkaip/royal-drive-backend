import { Request, Response, NextFunction } from 'express';

// Placeholder middlewares for future auth logic
export const basicAuthMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Implement real auth later (JWT/session/etc.)
  next();
};

export const requireRole = (..._roles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // Implement role-based access later
    next();
  };
};

export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key required',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  // Add your API key validation logic here if needed
  next();
};
