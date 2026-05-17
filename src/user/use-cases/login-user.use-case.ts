import { LoginUserCommand } from '../commands/login-user.command';

export interface LoginResult {
  accessToken: string;
}

export interface LoginUserUseCase {
  handle(command: LoginUserCommand): Promise<LoginResult>;
}
