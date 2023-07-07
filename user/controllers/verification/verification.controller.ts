import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiHeader } from '@nestjs/swagger';
import { MapEmailToUserPipe } from '../../query-mappers/map-email-to-user/map-email-to-user.pipe';
import { UserModel } from '../../../databases/models/user.model';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@ApiHeader({
  name: 'accept',
  allowEmptyValue: false,
  required: true,
  schema: {
    type: 'string',
    enum: ['application/json'],
  },
})
@Controller({
  path: 'verify/email',
})
export class VerificationController {
  constructor(
    private userRepo: UserRepoService,
    private configService: ConfigService,
  ) {}


  /**
   * Marks the user as verified
   * @param user
   * @param res
   */
  @ApiExcludeEndpoint()
  // @UseGuards(SignedUrlGuard)
  @Get()
  public async verify(
    @Query('email', MapEmailToUserPipe) user: UserModel,
    @Res() res: Response,
  ) {
    const redirectUrl = this.configService.get<string>('FRONT_END_APP_URL');

    if (!!user.verified_at) {
      return res.redirect(`${redirectUrl}`);
    }

    // @todo redirect to app
    await this.userRepo.markVerified(user);
    res.redirect(redirectUrl);
  }
}
