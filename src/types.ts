export const TYPES = {
  Application: Symbol.for('Application'),

  LoggerService: Symbol.for('LoggerService'),
  ConfigService: Symbol.for('ConfigSevice'),
  JwtService: Symbol.for('JwtService'),

  DatabaseService: Symbol.for('DatabaseService'),
  PrismaClient: Symbol.for('PrismaClient'),

  UserRepository: Symbol.for('UserRepository'),
  TokenRepository: Symbol.for('TokenRepository'),

  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  BlockUserUseCase: Symbol.for('BlockUserUseCase'),

  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
  SaveTokenUseCase: Symbol.for('SaveTokenUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
};
