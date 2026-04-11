import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const isApi = req.path.startsWith('/api');
  if (isApi) {
    console.log(`[API Request] ${req.method} ${req.path}`);
  }
  
  // Intercept HTML responses for API routes
  const originalSend = res.send;
  res.send = function(body) {
    if (isApi && typeof body === 'string' && body.includes('<!doctype html>')) {
      console.error(`[CRITICAL] API route ${req.path} attempted to send HTML!`);
      return res.status(500).json({ 
        message: 'Internal Server Error: API route returned HTML instead of JSON',
        path: req.path
      });
    }
    return originalSend.call(this, body);
  };
  
  next();
};
