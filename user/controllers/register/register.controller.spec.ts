import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { TransactionProviderService } from '../../../transaction-manager/services/transaction-provider/transaction-provider.service';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { UserModel } from '../../../databases/models/user.model';
import { RegisterUserDto } from '../../dtos/register/register-user.dto';
import { EmailVerificationService } from '../../services/email-verification/email-verification.service';

describe('RegisterController', () => {
  let controller: RegisterController;
  const userRepo: UserRepoService = {
    create: (value) => value,
  } as any;
  const emailVerification: EmailVerificationService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: TransactionProviderService,
          useValue: {},
        },
        {
          provide: UserRepoService,
          useValue: userRepo,
        },
        {
          provide: EmailVerificationService,
          useValue: emailVerification,
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user model', async () => {
    const userModel: UserModel = { email: 'test@test.com' } as any;
    const dto = new RegisterUserDto();
    const transaction = null;
    const createUser = jest
      .spyOn(userRepo, 'create')
      .mockReturnValue(Promise.resolve(userModel));

    expect(await controller.register(dto, transaction)).toEqual(userModel);
    expect(createUser).toHaveBeenCalledWith(dto, transaction);
  });
});
