import { Container } from 'inversify';
import { TYPES } from '../../../types';
import { ITokenRepository } from '../../repository/token.repository.interface';
import { SaveTokenUseCase } from '../../user-cases/save-token.use-case';
import { SaveTokenService } from './save-token.service';
import { Token } from '../../entities/token.entity';
import { SaveTokenCommand } from '../../commands/save-token.command';

const TokenRepositoryMock: ITokenRepository = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByUserId: jest.fn(),
  findByRefreshToken: jest.fn(),
};

const container = new Container();

let service: SaveTokenUseCase;

beforeAll(() => {
  container.bind<SaveTokenUseCase>(TYPES.SaveTokenUseCase).to(SaveTokenService);

  container
    .bind<ITokenRepository>(TYPES.TokenRepository)
    .toConstantValue(TokenRepositoryMock);

  service = container.get(TYPES.SaveTokenUseCase);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('handle', () => {
  it('updates existing token', async () => {
    (TokenRepositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(
      new Token('old-refresh', '1'),
    );

    await service.handle(new SaveTokenCommand('new-refresh', '1'));

    expect(TokenRepositoryMock.update).toHaveBeenCalled();
    expect(TokenRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('creates token if absent', async () => {
    (TokenRepositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(null);

    await service.handle(new SaveTokenCommand('refresh', '1'));

    expect(TokenRepositoryMock.create).toHaveBeenCalled();
    expect(TokenRepositoryMock.update).not.toHaveBeenCalled();
  });
});
