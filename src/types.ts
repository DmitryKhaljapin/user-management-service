export const TYPES = {
  Application: Symbol.for('Application'),

  LoggerService: Symbol.for('LoggerService'),
  ConfigService: Symbol.for('ConfigSevice'),
  JwtService: Symbol.for('JwtService'),

  DatabaseService: Symbol.for('DatabaseService'),
  PrismaClient: Symbol.for('PrismaClient'),

  UserRepository: Symbol.for('UserRepository'),
  TokenRepository: Symbol.for('TokenRepository'),

  AuthMapper: Symbol.for('AuthMapper'),

  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  BlockUserUseCase: Symbol.for('BlockUserUseCase'),

  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
  SaveTokenUseCase: Symbol.for('SaveTokenUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),

  AuthController: Symbol.for('AuthController'),
};
