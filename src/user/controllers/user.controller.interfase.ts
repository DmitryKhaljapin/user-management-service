import { NextFunction, Request, Response, Router } from 'express';

export interface IUserController {
  router: Router;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;

  getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  block(req: Request, res: Response, next: NextFunction): Promise<void>;
}
