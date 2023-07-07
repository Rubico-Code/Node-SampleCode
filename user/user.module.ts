import { Module } from '@nestjs/common';
import { UserRepoService } from './services/user-repo/user-repo.service';
import { RegisterController } from './controllers/register/register.controller';
import { HashEncryptService } from '../auth/services/hash-encrypt/hash-encrypt.service';
import { UniqueEmailValidator } from './validators/unique-email/unique-email.validator';
import { VerifyClientCredentialsValidator } from './validators/verify-client-credentials/verify-client-credentials.validator';
import { UserController } from './controllers/user/user.controller';
import { EmailVerificationService } from './services/email-verification/email-verification.service';
import { VerificationController } from './controllers/verification/verification.controller';
import { MapEmailToUserPipe } from './query-mappers/map-email-to-user/map-email-to-user.pipe';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UrlGeneratorModule } from 'nestjs-url-generator';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    EventEmitterModule,
    UrlGeneratorModule,
    HttpModule,
  ],
  providers: [
    UserRepoService,
    HashEncryptService,
    UniqueEmailValidator,
    VerifyClientCredentialsValidator,
    EmailVerificationService,
    MapEmailToUserPipe,
  ],
  controllers: [
    RegisterController,
    UserController,
    VerificationController,
  ],
})
export class UserModule {}
