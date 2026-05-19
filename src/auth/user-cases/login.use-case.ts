import { LoginCommand } from '../commands/login.command';

export interface LoginResult {
  accessToken: string;
}

export interface LoginUseCase {
  handle(command: LoginCommand): Promise<LoginResult>;
}
