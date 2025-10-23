import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  /*
  This is a placeholder for the actual authentication logic.
  It's deliberately stubbed out for the code review.
  You may assume proper authenticaiton happens here.
  */
 
  next();
}

