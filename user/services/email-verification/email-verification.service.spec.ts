import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationService } from './email-verification.service';
import { MailService } from '../../../mail/services/mail/mail.service';
import { UserModel } from '../../../databases/models/user.model';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { VerificationController } from '../../controllers/verification/verification.controller';
import * as mockdate from 'mockdate';

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  const mailService: MailService = {
    sendMail: (value) => value,
  } as any;
  const urlGenerator: UrlGeneratorService = {
    signedControllerUrl: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationService,
        {
          provide: MailService,
          useValue: mailService,
        },
        {
          provide: UrlGeneratorService,
          useValue: urlGenerator,
        },
      ],
    }).compile();

    service = module.get<EmailVerificationService>(EmailVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when email sent', async () => {
    const user: UserModel = {
      email: 'test@mailinator.com',
    } as any;
    const mailData = {
      template: 'emails/email-verification',
      context: { verificationUrl: 'signedUrl' },
      to: user.email,
      subject: 'Email verification action',
    };

    const sendEmailSpy = jest
      .spyOn(mailService, 'sendMail')
      .mockReturnValueOnce(Promise.resolve(true));

    const signedUrlSpy = jest
      .spyOn(urlGenerator, 'signedControllerUrl')
      .mockReturnValueOnce('signedUrl');
    mockdate.set('2021-01-01 00:000:00');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    expect(await service.sendVerificationEmail(user)).toEqual(true);
    expect(sendEmailSpy).toHaveBeenCalledWith(mailData);
    expect(signedUrlSpy).toHaveBeenCalledWith({
      controller: VerificationController,
      controllerMethod: VerificationController.prototype.verify,
      expirationDate: expiryDate,
      query: { email: user.email },
    });
  });
});
