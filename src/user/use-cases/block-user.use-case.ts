import { BlockUserCommand } from '../commands/block-user.command';

export interface BlockUserUseCase {
  handle(command: BlockUserCommand): Promise<void>;
}
