import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserModel } from '../../../databases/models/user.model';
import { AuthUser } from '../../../auth/decorators/auth-user.decorator';

@ApiHeader({
  name: 'accept',
  allowEmptyValue: false,
  required: true,
  schema: {
    type: 'string',
    enum: ['application/json'],
  },
})
@ApiBearerAuth()
@ApiTags('User Management')
@Controller({
  path: 'users',
  version: ['1'],
})
export class UserController {
  @ApiOkResponse({ type: UserModel })
  @Get('current')
  public current(@AuthUser() user: UserModel) {
    return user;
  }
}
