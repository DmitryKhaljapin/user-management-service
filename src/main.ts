import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './App';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IDatabaseService } from './database/database.service.interface';
import { ILogger } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { DatabaseService } from './database/database.service';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { AuthController } from './auth/controller/auth.controller';
import { AuthMapper } from './auth/mappers/auth.mapper';
import { TokenRepository } from './auth/repository/token.repository';
import { ITokenRepository } from './auth/repository/token.repository.interface';
import { JwtService } from './auth/services/jwt/jwt.service';
import { IJwtService } from './auth/services/jwt/jwt.service.interface';
import { LoginUserService } from './auth/services/login/login.service';
import { LogoutService } from './auth/services/logout/logout.service';
import { RefreshTokenService } from './auth/services/refresh-token/refresh-token.service';
import { SaveTokenService } from './auth/services/save-token/save-token.service';
import { UserMapper } from './user/mappers/user.mapper';
import { UserRepository } from './user/repository/user.repository';
import { IUserRepository } from './user/repository/user.repository.interface';
import { BlockUserService } from './user/services/block-user/block-user.service';
import { GetUserByIdService } from './user/services/get-user-by-id/get-user-by-id.service';
import { GetUsersService } from './user/services/get-users/get-users.service';
import { RegisterUserService } from './auth/services/register-user/register-user.service';
import { UserController } from './user/controllers/user.controller';
import { IMiddleware } from './common/middleware.interface';
import { AuthMiddleware } from './common/auth.middleware';

export const appBindings = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<App>(TYPES.Application).to(App);

    options.bind<ILogger>(TYPES.LoggerService).to(LoggerService);

    options.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);

    options
      .bind<IJwtService>(TYPES.JwtService)
      .to(JwtService)
      .inSingletonScope();

    options
      .bind<IDatabaseService>(TYPES.DatabaseService)
      .to(DatabaseService)
      .inSingletonScope();

    options
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toDynamicValue((context) => {
        const config = context.get<IConfigService>(TYPES.ConfigService);

        const connectionString = config.get('DB_URI');

        const adapter = new PrismaPg({
          connectionString,
        });

        return new PrismaClient({
          adapter,
        });
      })
      .inSingletonScope();

    options.bind<IMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

    options.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

    options.bind<ITokenRepository>(TYPES.TokenRepository).to(TokenRepository);

    options.bind<UserMapper>(TYPES.UserMapper).to(UserMapper);

    options.bind<AuthMapper>(TYPES.AuthMapper).to(AuthMapper);

    options.bind(TYPES.RegisterUserUseCase).to(RegisterUserService);

    options.bind(TYPES.GetUserByIdUseCase).to(GetUserByIdService);

    options.bind(TYPES.GetUsersUseCase).to(GetUsersService);

    options.bind(TYPES.BlockUserUseCase).to(BlockUserService);

    options.bind(TYPES.LoginUseCase).to(LoginUserService);

    options.bind(TYPES.RefreshTokenUseCase).to(RefreshTokenService);

    options.bind(TYPES.SaveTokenUseCase).to(SaveTokenService);

    options.bind(TYPES.LogoutUseCase).to(LogoutService);

    options.bind<AuthController>(TYPES.AuthController).to(AuthController);

    options.bind<UserController>(TYPES.UserController).to(UserController);
  },
);

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
}

bootstrap();
