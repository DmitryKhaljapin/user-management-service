export const TYPES = {
  Application: Symbol.for('Application'),

  LoggerService: Symbol.for('LoggerService'),
  ConfigService: Symbol.for('ConfigSevice'),

  DatabaseService: Symbol.for('DatabaseService'),
  PrismaClient: Symbol.for('PrismaClient'),
  UserRepository: Symbol.for('UserRepository'),

  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  GetUsersQueryUseCase: Symbol.for('GetUsersQueryUseCase'),
};
