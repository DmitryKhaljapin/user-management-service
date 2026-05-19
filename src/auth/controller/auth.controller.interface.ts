import { NextFunction, Request, Response, Router } from 'express';

export interface IAuthController {
  router: Router;
  register(req: Request, res: Response, next: NextFunction): Promise<void>;

  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;

  refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
}
