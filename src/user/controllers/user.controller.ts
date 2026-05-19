import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../common/base.controller';

import { TYPES } from '../../types';

import { GetUsersUseCase } from '../use-cases/get-users.use-case';
import { BlockUserUseCase } from '../use-cases/block-user.use-case';

import { ILogger } from '../../logger/logger.service.interface';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case';

import { UserMapper } from '../mappers/user.mapper';
import { IUserController } from './user.controller.interfase';
import { AuthMiddleware } from '../../common/middlewares/auth.middleware';
import { IConfigService } from '../../config/config.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.LoggerService)
    logger: ILogger,

    @inject(TYPES.UserMapper)
    private mapper: UserMapper,

    @inject(TYPES.GetUserByIdUseCase)
    private getUserUseCase: GetUserByIdUseCase,

    @inject(TYPES.GetUsersUseCase)
    private getUsersUseCase: GetUsersUseCase,

    @inject(TYPES.BlockUserUseCase)
    private blockUserUseCase: BlockUserUseCase,

    @inject(TYPES.AuthMiddleware)
    private authMiddleware: AuthMiddleware,
  ) {
    super(logger);

    this.bindRoutes([
      {
        path: '/',
        method: 'get',
        func: this.getAll,
        middlewares: [this.authMiddleware],
      },

      {
        path: '/:id',
        method: 'get',
        func: this.getById,
        middlewares: [this.authMiddleware],
      },

      {
        path: '/:id/block',
        method: 'patch',
        func: this.block,
        middlewares: [this.authMiddleware],
      },
    ]);
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toGetUsersQuery(req);

    const users = await this.getUsersUseCase.handle(command);

    const usersResponse = users.map(this.mapper.toUserResponse);

    this.ok(res, usersResponse);
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);

    const command = this.mapper.toGetUserByIdQuery(req);

    const user = await this.getUserUseCase.handle(command);

    const userResponse = this.mapper.toUserResponse(user);

    this.ok(res, userResponse);
  }

  public async block(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toBlockCommand(req);

    await this.blockUserUseCase.handle(command);

    this.noContent(res);
  }
}
