import axios from 'axios';
import { LoggerInstance } from 'winston';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../app/case/CaseApi';
import { UpdateCaseResponse } from '../../../app/case/api-utility';
import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';

import PayAndSubmitPostController from './PayAndSubmitPostController';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);
const updateCaserMock = jest.spyOn(CaseApi.prototype, 'updateCase');
const mockLogger = {
  error: jest.fn().mockImplementation((message: string) => message),
  info: jest.fn().mockImplementation((message: string) => message),
} as unknown as LoggerInstance;

describe('pay-your-fee > pay and submit post controller', () => {
  let req;
  let res;
  let controller;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    controller = new PayAndSubmitPostController({});
    req.locals.logger = mockLogger;
    req.session.user.accessToken = 'authToken';
    req.session.userCase.id = '2122323';
    req.headers.host = 'localhost:3001';
    jest.clearAllMocks();
  });

  test('should handle payment if no errors present', async () => {
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    const paymentDetailsRequestBody = {
      payment_reference: 'a',
      date_created: 'b',
      external_reference: 'c',
      next_url: '/payment',
      status: 'failure',
      serviceRequestReference: 'e',
    };
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetailsRequestBody,
      },
    });
    updateCaserMock.mockResolvedValue({ applicantFirstName: 'test' } as unknown as UpdateCaseResponse);

    await controller.post(req, res);
    await new Promise(process.nextTick);

    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(res.redirect).toHaveBeenCalledWith('/payment');
  });

  test('should redirect to hwf page if hwfPaymentSelection is yes', async () => {
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    req.body.hwfPaymentSelection = 'Yes';
    req.session.userCase.helpWithFeesReferenceNumber = 'HWF-123';
    await controller.post(req, res);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(req.session.userCase.helpWithFeesReferenceNumber).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith('/help-with-fee');
  });

  test('should redirect to pay your fee page if errors present', async () => {
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    req.body.errors = [{ errorProperty: 'hwfPaymentSelection', errorType: 'required' }];

    const mockFormContent = {
      fields: {
        hwfPaymentSelection: {
          validator: isFieldFilledIn,
        },
      },
    } as unknown as FormContent;

    await new PayAndSubmitPostController(mockFormContent.fields).post(req, res);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
  });

  test('should catch error and redirect to pay your fee screen', async () => {
    req.session.userCase = undefined;
    await controller.post(req, res);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
  });
});
