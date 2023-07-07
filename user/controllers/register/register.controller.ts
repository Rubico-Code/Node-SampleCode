import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionInterceptor } from '../../../transaction-manager/interceptors/transaction/transaction.interceptor';
import { ReqTransaction } from '../../../transaction-manager/decorators/transaction/transaction.decorator';
import { Transaction } from 'sequelize';
import { UserModel } from '../../../databases/models/user.model';
import { RegisterUserDto } from '../../dtos/register/register-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { SuccessResponseInterceptor } from '../../../password-manager/interceptors/success-response/success-response.interceptor';
import { SuccessResponse } from '../../../password-manager/interceptors/success-response/success-response';
import { AuthUser } from '../../../auth/decorators/auth-user.decorator';
import { EmailVerificationService } from '../../services/email-verification/email-verification.service';

@ApiTags('Registration')
@Controller({
  version: ['1'],
  path: 'register',
})
export class RegisterController {
  constructor(
    private userRepo: UserRepoService,
    private emailVerification: EmailVerificationService,
  ) {}

  @ApiCreatedResponse({ type: UserModel })
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() userData: RegisterUserDto,
    @ReqTransaction() transaction?: Transaction,
  ): Promise<UserModel | void> {
    return this.userRepo.create(userData, transaction);
  }

  @ApiBearerAuth()
  @UseInterceptors(SuccessResponseInterceptor)
  @ApiCreatedResponse({ type: SuccessResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('verification/resend')
  public async resendEmail(@AuthUser() user: UserModel): Promise<boolean> {
    return await this.emailVerification.sendVerificationEmail(user);
  }
}
