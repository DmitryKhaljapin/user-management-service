import { injectable } from 'inversify';

import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { GetUsersQuery } from '../queries/get-users.query';
import { BlockUserCommand } from '../commands/block-user.command';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

@injectable()
export class UserMapper {
  public toGetUserByIdQuery(req: Request): GetUserByIdQuery {
    const id = req.params.id as string;

    return new GetUserByIdQuery(req.user.id, req.user.role, id);
  }

  public toGetUsersQuery(req: Request): GetUsersQuery {
    return new GetUsersQuery(req.user.role);
  }

  public toBlockCommand(req: Request): BlockUserCommand {
    const id = req.params.id as string;

    return new BlockUserCommand(req.user.id, req.user.role, id);
  }

  toUserResponse(user: User): UserResponseDto {
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
