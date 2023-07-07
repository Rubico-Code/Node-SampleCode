import { SuccessResponseInterceptor } from './success-response.interceptor';
import { firstValueFrom, of } from 'rxjs';
import { SuccessResponse } from './success-response';

describe('SuccessResponseInterceptor', () => {
  let interceptor: SuccessResponseInterceptor;

  beforeEach(() => {
    interceptor = new SuccessResponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return success response', async () => {
    expect(
      await firstValueFrom(
        interceptor.intercept({} as any, { handle: () => of(true) }),
      ),
    ).toBeInstanceOf(SuccessResponse);
  });
});
