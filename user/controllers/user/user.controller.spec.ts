import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModel } from '../../../databases/models/user.model';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return current logged in user', () => {
    const user: UserModel = { id: 1 } as any;
    expect(controller.current(user)).toEqual(user);
  });
});
