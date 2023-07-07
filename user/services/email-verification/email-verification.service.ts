import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../databases/models/user.model';
import { MailService } from '../../../mail/services/mail/mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEvents } from '../../../system-events/system-events';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { VerificationController } from '../../controllers/verification/verification.controller';

@Injectable()
export class EmailVerificationService {
  constructor(
    private urlGenerator: UrlGeneratorService,
    private mailer: MailService,
  ) {}

  @OnEvent(SystemEvents.UserModelCreated)
  public async sendVerificationEmail(user: UserModel): Promise<boolean> {
    const verificationUrl = this.urlGenerator.signedControllerUrl({
      controller: VerificationController,
      controllerMethod: VerificationController.prototype.verify,
      expirationDate: this.expiryDate(),
      query: { email: user.email },
    });
    console.log(verificationUrl);
    return this.mailer.sendMail({
      template: 'emails/email-verification',
      to: user.email,
      subject: 'Email Verification',
      context: {
        verificationUrl,
      },
    });
  }

  /**
   * Returns an expiry date
   */
  public expiryDate(): Date {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  }
}
