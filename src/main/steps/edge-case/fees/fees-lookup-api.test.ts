import { LoggerInstance } from 'winston';

import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { UserDetails } from '../../../app/controller/AppRequest';

import { getApplicationFee } from './fees-lookup-api';

jest.mock('axios');

describe('getC100ApplicationFee', () => {
  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw an error', async () => {
    const userDetails: UserDetails = {
      accessToken: '123',
      email: 'billy@bob.com',
      givenName: 'billy',
      familyName: 'bob',
      id: '1234',
    };

    try {
      await getApplicationFee(userDetails, 'PO' as TYPE_OF_APPLICATION, mockLogger);
    } catch (err) {
      //eslint-disable-next-line jest/no-conditional-expect
      expect(err.message).toBe('Error occured, fee could not be fetched. - getApplicationFee');
      //eslint-disable-next-line jest/no-conditional-expect
      await expect(getApplicationFee(userDetails, 'PO' as TYPE_OF_APPLICATION, mockLogger)).rejects.toThrow(
        'Error occured, fee could not be fetched. - getApplicationFee'
      );
      //eslint-disable-next-line jest/no-conditional-expect
      expect(mockLogger.error).toHaveBeenCalled();
    }
  });
});
