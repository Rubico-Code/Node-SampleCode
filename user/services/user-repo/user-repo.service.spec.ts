import { Test, TestingModule } from '@nestjs/testing';
import { UserRepoService } from './user-repo.service';
import { UserModel } from '../../../databases/models/user.model';
import { getModelToken } from '@nestjs/sequelize';
import { EmptyResultError } from 'sequelize';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('UserRepoService', () => {
  let service: UserRepoService;
  const hashEncryption: HashEncryptService = {
    createHash: (value) => value,
  } as any;

  const model: typeof UserModel = {
    findOne: (value) => value,
    findByPk: (value) => value,
    build: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepoService,
        {
          provide: getModelToken(UserModel),
          useValue: model,
        },
        {
          provide: HashEncryptService,
          useValue: hashEncryption,
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserRepoService>(UserRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user model by email when found', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findOneSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(await service.findByEmail(userModel.email, transaction)).toEqual(
      userModel,
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userModel.email },
      transaction,
    });
  });

  it('should return null when find by email fails to find user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findOneSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValueOnce(Promise.resolve(undefined));

    const transaction = null;

    expect(await service.findByEmail(userModel.email, transaction)).toEqual(
      null,
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userModel.email },
      transaction,
    });
  });

  it('should find the user by id', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findSpy = jest
      .spyOn(model, 'findByPk')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(await service.findOrFail(userModel.id, transaction)).toEqual(
      userModel,
    );

    expect(findSpy).toHaveBeenCalledWith(userModel.id, {
      transaction,
      rejectOnEmpty: true,
    });
  });

  it('should return user when find by email results in user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findByEmailSpy = jest
      .spyOn(service, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(
      await service.findByEmailOrFail(userModel.email, transaction),
    ).toEqual(userModel);

    expect(findByEmailSpy).toHaveBeenCalledWith(userModel.email, transaction);
  });

  it('should throw exception when find by email or fail does not return user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findByEmailSpy = jest
      .spyOn(service, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const transaction = null;
    let errorMapped = false;

    try {
      await service.findByEmailOrFail(userModel.email, transaction);
    } catch (err) {
      if (err instanceof EmptyResultError) {
        errorMapped = true;
      }
    }
    expect(errorMapped).toEqual(true);
    expect(findByEmailSpy).toHaveBeenCalledWith(userModel.email, transaction);
  });

  it('should create a user model', async () => {
    const userModel: UserModel = {
      id: 1,
      save: (value) => value,
      setAttributes: (value) => value,
    } as any;

    const userData = {
      email: 'test@test.com',
      password: 'Abc@123',
      name: 'name',
    };

    const buildSpy = jest.spyOn(model, 'build').mockReturnValue(userModel);
    const setAttributeSpy = jest
      .spyOn(userModel, 'setAttributes')
      .mockReturnValue(userModel);

    const hashService = jest
      .spyOn(hashEncryption, 'createHash')
      .mockReturnValueOnce(Promise.resolve('string'));

    const saveSpy = jest
      .spyOn(userModel, 'save')
      .mockReturnValue(Promise.resolve(userModel));
    const transaction = null;

    expect(await service.create(userData, transaction)).toEqual(userModel);
    expect(buildSpy).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(1, userData);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(2, { password: 'string' });
    expect(hashService).toHaveBeenCalledWith(userData.password);
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
  });

  it('should set new password for user', async () => {
    const user: UserModel = {
      save: (value) => value,
      setAttributes: (value) => value,
    } as any;

    const hashSpy = jest
      .spyOn(hashEncryption, 'createHash')
      .mockReturnValue(Promise.resolve('newHash'));
    const saveSpy = jest
      .spyOn(user, 'save')
      .mockReturnValue(Promise.resolve(user));
    const setAttributesSpy = jest
      .spyOn(user, 'setAttributes')
      .mockReturnValue(user);

    const transaction = null;
    expect(
      await service.changePassword(user, 'newPassword', transaction),
    ).toEqual(user);
    expect(setAttributesSpy).toHaveBeenCalledWith({ password: 'newHash' });
    expect(hashSpy).toHaveBeenCalledWith('newPassword');
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
  });
});
