import { SaveTokenCommand } from '../commands/save-token.command';

export interface SaveTokenUseCase {
  handle(command: SaveTokenCommand): Promise<void>;
}
