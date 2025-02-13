import Axios, { AxiosStatic } from 'axios';

import { CALLBACK_URL } from '../../../steps/urls';

import { getRedirectUrl, getSystemUser, getUserDetails } from './oidc';

jest.mock('axios');

const mockedAxios = Axios as jest.Mocked<AxiosStatic>;

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ';

describe('getRedirectUrl', () => {
  test('should create a valid URL to redirect to the login screen', () => {
    expect(getRedirectUrl('http://localhost', CALLBACK_URL)).toBe(
      'https://idam-web-public.aat.platform.hmcts.net/login?client_id=ds-ui&response_type=code&redirect_uri=http://localhost/receiver'
    );
  });
});

describe('getUserDetails', () => {
  test('should throw error', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: token,
        id_token: token,
      },
    });

    await expect(getUserDetails('http://localhost', '123', CALLBACK_URL)).rejects.toThrowError(
      'Failed to get user details: undefined undefined'
    );
  });
});

describe('getCaseWorkerUser', () => {
  test('should retrieve a token with caseworker username and password then decode the JWT to get user details', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: token,
        id_token: token,
      },
    });

    const result = await getSystemUser();
    expect(result).toStrictEqual({
      accessToken: token,
      email: 'test@test.com',
      givenName: 'John',
      familyName: 'Dorian',
      id: '123',
    });
  });
});
