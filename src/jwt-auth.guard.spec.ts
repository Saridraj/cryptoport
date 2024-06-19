import { Authorize } from './jwt-auth.guard';
import * as jwt from 'jsonwebtoken';

describe('Authorize Guard', () => {
  let authorize: Authorize;

  beforeEach(() => {
    authorize = new Authorize();
  });

  it('should return true if token is valid', async () => {
    const mockExecutionContext = {
      args: [
        {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      ],
    };

    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: 1 }));

    const result = await authorize.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should return false if token is invalid', async () => {
    const mockExecutionContext = {
      args: [
        {
          headers: {
            authorization: 'Bearer invalid-token',
          },
        },
      ],
    };

    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = await authorize.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should return false if no authorization header is present', async () => {
    const mockExecutionContext = {
      args: [{}],
    };

    const result = await authorize.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
