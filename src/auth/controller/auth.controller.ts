import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../common/base.controller';
import { TYPES } from '../../types';

import { AuthMapper } from '../mappers/auth.mapper';
import { ILogger } from '../../logger/logger.service.interface';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { IAuthController } from './auth.controller.interface';
import { ValidateMiddleware } from '../../common/middlewares/validation.middleware';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginrUserDto } from '../dto/login-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@injectable()
export class AuthController extends BaseController implements IAuthController {
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
        middlewares: [new ValidateMiddleware(RegisterUserDto)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.loginUser,
        middlewares: [new ValidateMiddleware(LoginrUserDto)],
      },
      {
        path: '/refresh',
        method: 'post',
        func: this.refreshToken,
        middlewares: [new ValidateMiddleware(RefreshTokenDto)],
      },
      {
        path: '/logout',
        method: 'post',
        func: this.logoutUser,
      },
    ]);
  }

  public async registerUser(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toRegisterCommand(req);

    const user = await this.register.handle(command);

    const userResponseDto = this.mapper.toRegistrationResponse(user);

    this.created(res, userResponseDto);
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toLoginCommand(req);

    const result = await this.login.handle(command);

    this.ok(res, result);
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toRefreshCommand(req);

    const result = await this.refresh.handle(command);

    this.ok(res, result);
  }

  public async logoutUser(req: Request, res: Response, next: NextFunction) {
    const command = this.mapper.toRefreshCommand(req);

    await this.logout.handle(command);

    this.noContent(res);
  }
}
