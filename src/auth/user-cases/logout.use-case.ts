import { LogoutCommand } from '../commands/logout.command';

export interface LogoutUseCase {
  handle(command: LogoutCommand): Promise<void>;
}
