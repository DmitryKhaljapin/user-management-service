import { Response, Router } from 'express';
import { ILogger } from '../logger/logger.service.interface';
import { IControllerRoute } from './controllerRoute.interface';

export abstract class BaseController {
  private readonly _router: Router;

  constructor(protected readonly logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  protected send<T>(res: Response, code: number, message: T) {
    res.type('application/json');

    return res.status(code).json(message);
  }

  protected ok<T>(res: Response, message: T) {
    return this.send(res, 200, message);
  }

  protected created<T>(res: Response, message?: T) {
    return message ? this.send(res, 201, message) : res.sendStatus(201);
  }

  protected noContent(res: Response) {
    return res.sendStatus(204);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);

      const middleware =
        route.middlewares?.map((middleware) =>
          middleware.execute.bind(middleware),
        ) ?? [];

      const handler = route.func.bind(this);

      this.router[route.method](route.path, ...middleware, handler);
    });
  }
}
