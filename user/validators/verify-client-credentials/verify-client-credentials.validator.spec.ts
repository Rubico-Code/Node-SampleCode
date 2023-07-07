import { VerifyClientCredentialsValidator } from './verify-client-credentials.validator';
import { ClientRepoService } from '../../../auth/services/oauth/client-repo/client-repo.service';
import { ClientModel } from '../../../databases/models/oauth/client.model';

describe('VerifyClientCredentialsValidator', () => {
  let validator: VerifyClientCredentialsValidator;

  const clientRepo: ClientRepoService = {
    findForIdAndSecret: (value) => value,
  } as any;

  beforeEach(() => {
    validator = new VerifyClientCredentialsValidator(clientRepo);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return true when client id is null', async () => {
    const obj = {} as any;
    expect(await validator.validate(null, obj)).toEqual(true);
  });

  it('should return true when client secret is null', async () => {
    const client_id = '1';
    const validationArguments = {
      constraints: ['client_secret'],
      object: { client_secret: '' },
    };
    expect(
      await validator.validate(client_id, validationArguments as any),
    ).toEqual(true);
  });

  it('should return default error message', () => {
    expect(validator.defaultMessage()).toEqual(
      'The client credentials are incorrect',
    );
  });

  it('should return true when client credential matched', async () => {
    const client: ClientModel = {
      id: '1',
      secret: 'test',
    } as any;

    const client_id = '1';

    const validationArguments = {
      constraints: ['client_secret'],
      object: { client_secret: 'secret' },
    };

    const spyFindForIdAndSecret = jest
      .spyOn(clientRepo, 'findForIdAndSecret')
      .mockReturnValue(Promise.resolve(client));

    expect(
      await validator.validate(client_id, validationArguments as any),
    ).toEqual(true);
    expect(spyFindForIdAndSecret).toHaveBeenCalledWith(client_id, 'secret');
  });

  it('should return false when client credentials are not matched', async () => {
    const client_id = '1';

    const validationArguments = {
      constraints: ['client_secret'],
      object: { client_secret: 'secret' },
    };

    const spyFindForIdAndSecret = jest
      .spyOn(clientRepo, 'findForIdAndSecret')
      .mockReturnValue(Promise.resolve(null));

    expect(
      await validator.validate(client_id, validationArguments as any),
    ).toEqual(false);
    expect(spyFindForIdAndSecret).toHaveBeenCalledWith(client_id, 'secret');
  });
});
