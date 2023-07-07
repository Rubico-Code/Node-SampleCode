import { Test, TestingModule } from '@nestjs/testing';
import { VerificationController } from './verification.controller';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { ConfigService } from '@nestjs/config';

describe('VerificationController', () => {
  let controller: VerificationController;
  const urlGenerator: UrlGeneratorService = {} as any;
  const userRepo: UserRepoService = {} as any;
  const configService: ConfigService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers: [
        {
          provide: UrlGeneratorService,
          useValue: urlGenerator,
        },
        {
          provide: UserRepoService,
          useValue: userRepo,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    controller = module.get<VerificationController>(VerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
