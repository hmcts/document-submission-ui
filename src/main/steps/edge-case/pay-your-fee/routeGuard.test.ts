import axios from 'axios';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { mockUserCase1 } from '../../../../test/unit/utils/mockUserCase';
import { TYPE_OF_APPLICATION } from '../../../app/case/definition';

import { routeGuard } from './routeGuard';

jest.mock('axios');

describe('pay your fee > routeGuard', () => {
  let req;
  let res;
  const next = jest.fn();

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });
  test('get should call next', async () => {
    req.session.paymentError = {
      hasError: true,
      errorContext: null,
    };

    await routeGuard.get(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('get should call next after application free', async () => {
    req.session.usercase = mockUserCase1;
    req.session.userCase.edgeCaseTypeOfApplication = TYPE_OF_APPLICATION.FGM;
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn(() => mockedAxios);
    mockedAxios.get.mockResolvedValueOnce({ status: '200', data: { feeAmount: '20' } });
    req.session.paymentError = {
      hasError: true,
      errorContext: null,
    };
    await routeGuard.get(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('get should call next after wit out application free', async () => {
    req.session.usercase = mockUserCase1;
    req.session.userCase.edgeCaseTypeOfApplication = TYPE_OF_APPLICATION.FGM;
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn(() => mockedAxios);
    mockedAxios.get.mockResolvedValueOnce({ status: '200' });
    req.session.paymentError = {
      hasError: true,
      errorContext: null,
    };
    await routeGuard.get(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
