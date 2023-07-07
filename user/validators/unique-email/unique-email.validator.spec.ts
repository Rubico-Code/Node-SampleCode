import { UniqueEmailValidator } from './unique-email.validator';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { UserModel } from '../../../databases/models/user.model';

describe('UniqueEmailValidator', () => {
  let validator: UniqueEmailValidator;
  const userRepo: UserRepoService = {
    findByEmail: (value) => value,
  } as any;

  beforeEach(() => {
    validator = new UniqueEmailValidator(userRepo);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return true when email is null or undefined', async () => {
    expect(await validator.validate(undefined)).toEqual(true);
    expect(await validator.validate(null)).toEqual(true);
  });

  it('should return false when email is found', async () => {
    const userModel: UserModel = { email: 'email@email.com' } as any;
    const findByEmail = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValue(Promise.resolve(userModel));

    expect(await validator.validate('email@email.com')).toEqual(false);
    expect(findByEmail).toHaveBeenCalledWith('email@email.com');
  });

  it('should return true when email not found', async () => {
    const findByEmail = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValue(Promise.resolve(null));
    expect(await validator.validate('email@email.com')).toEqual(true);
    expect(findByEmail).toHaveBeenCalledWith('email@email.com');
  });

  it('should return default error message', () => {
    expect(validator.defaultMessage({ value: 'test' } as any)).toEqual(
      'The email test already exists',
    );
  });
});
