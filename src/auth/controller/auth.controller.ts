import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../common/base.controller';
import { TYPES } from '../../types';

import { AuthMapper } from '../mappers/auth.mapper';
import { ILogger } from '../../logger/logger.service.interface';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(TYPES.LoggerService)
    logger: ILogger,

    @inject(TYPES.AuthMapper)
    private mapper: AuthMapper,

    @inject(TYPES.RegisterUserUseCase)
    private register: RegisterUserUseCase,

    @inject(TYPES.LoginUseCase)
    private login: LoginUseCase,

    @inject(TYPES.RefreshTokenUseCase)
    private refresh: RefreshTokenUseCase,

    @inject(TYPES.LogoutUseCase)
    private logout: LogoutUseCase,
  ) {
    super(logger);

    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.registerUser,
      },
      {
        path: '/login',
        method: 'post',
        func: this.loginUser,
      },
      {
        path: '/refresh',
        method: 'post',
        func: this.refreshToken,
      },
      {
        path: '/logout',
        method: 'post',
        func: this.logoutUser,
      },
    ]);
  }

  public registerUser = async (req: Request, res: Response) => {
    const command = this.mapper.toRegisterCommand(req);

    const user = await this.register.handle(command);

    const userResponseDto = this.mapper.toRegistrationResponse(user);

    return this.created(res, userResponseDto);
  };

  public loginUser = async (req: Request, res: Response) => {
    const command = this.mapper.toLoginCommand(req);

    const result = await this.login.handle(command);

    return this.ok(res, result);
  };

  public refreshToken = async (req: Request, res: Response) => {
    const command = this.mapper.toRefreshCommand(req);

    const result = await this.refresh.handle(command);

    return this.ok(res, result);
  };

  public logoutUser = async (req: Request, res: Response) => {
    const command = this.mapper.toRefreshCommand(req);

    await this.logout.handle(command);

    return this.noContent(res);
  };
}
