import { injectable } from 'inversify';
import { Request } from 'express';

import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { LoginCommand } from '../commands/login.command';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginrUserDto } from '../dto/login-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterUserCommand } from '../commands/register-user.command';
import { User } from '../../user/entities/user.entity';
import { UserResponseDto } from '../../user/dto/user-response.dto';

@injectable()
export class AuthMapper {
  toRegisterCommand(req: Request<{}, {}, RegisterUserDto>) {
    const dto = req.body;

    return new RegisterUserCommand(
      dto.firstName,
      dto.lastName,
      new Date(dto.birthDate),
      dto.email,
      dto.password,
      dto.middleName,
    );
  }

  toLoginCommand(req: Request<{}, {}, LoginrUserDto>) {
    const { email, password } = req.body;

    return new LoginCommand(email, password);
  }

  toRefreshCommand(req: Request<{}, {}, RefreshTokenDto>) {
    return new RefreshTokenCommand(req.body.refreshToken);
  }

  toRegistrationResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
