import { FindUserByIdValidator } from './find-user-by-id.validator';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { UserModel } from '../../../databases/models/user.model';

describe('FindUserByIdValidator', () => {
  let validator: FindUserByIdValidator;
  const userRepo: UserRepoService = {
    findOrFail: (value) => value,
  } as any;

  beforeEach(() => {
    validator = new FindUserByIdValidator(userRepo);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return default error message', () => {
    expect(validator.defaultMessage({ value: '1' } as any)).toEqual(
      'User with id 1 not exist',
    );
  });

  it('should return true when user found', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findByIdSpy = jest
      .spyOn(userRepo, 'findOrFail')
      .mockReturnValue(Promise.resolve(userModel));
    expect(await validator.validate(userModel.id)).toEqual(true);
    expect(findByIdSpy).toHaveBeenCalledWith(userModel.id);
  });
});
