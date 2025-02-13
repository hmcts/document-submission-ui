import axios from 'axios';
import { LoggerInstance } from 'winston';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../app/case/CaseApi';
import { UpdateCaseResponse } from '../../../app/case/api-utility';
import { CASE_EVENT, TYPE_OF_APPLICATION } from '../../../app/case/definition';

import { PaymentHandler, PaymentValidationHandler, submitCase } from './paymentController';

const mockToken = 'authToken';

const dummyCaseID = '2122323';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);
const updateCaserMock = jest.spyOn(CaseApi.prototype, 'updateCase');
const mockLogger = {
  error: jest.fn().mockImplementation((message: string) => message),
  info: jest.fn().mockImplementation((message: string) => message),
} as unknown as LoggerInstance;

let req;
let res;

describe('PaymentHandler', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    req.locals.logger = mockLogger;
    req.session.user.accessToken = mockToken;
    req.session.userCase.id = dummyCaseID;
    req.headers.host = 'localhost:3001';
    jest.clearAllMocks();
  });

  test('Should submit case with hwfRefNumber', async () => {
    req.session.userCase.helpWithFeesReferenceNumber = 'HWF-123';
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    req.body.saveAndContinue = true;
    const paymentDetailsRequestBody = {
      payment_reference: 'a',
      date_created: 'b',
      external_reference: 'c',
      next_url: 'd',
      status: 'Success',
      serviceRequestReference: 'e',
    };
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetailsRequestBody,
      },
    });
    req.locals.api.updateCase = jest.fn().mockResolvedValue({
      ...req.session.userCase,
      paymentDetails: paymentDetailsRequestBody,
    } as unknown as UpdateCaseResponse);
    await PaymentHandler(req, res);
    await new Promise(process.nextTick);
    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(req.session.userCase.paymentDetails).toStrictEqual(paymentDetailsRequestBody);
    expect(res.redirect).toHaveBeenCalledWith('/application-submitted');
  });

  test('Should submit case for previous successful payment', async () => {
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    req.session.userCase.helpWithFeesReferenceNumber = 'HWF-123';
    req.session.userCase.hwfPaymentSelection = 'No';
    const paymentDetailsRequestBody = {
      payment_reference: 'a',
      date_created: 'b',
      external_reference: 'c',
      next_url: 'd',
      status: 'Success',
      serviceRequestReference: 'e',
    };
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetailsRequestBody,
      },
    });
    req.locals.api.updateCase = jest.fn().mockResolvedValue({
      ...req.session.userCase,
      hwfPaymentSelection: undefined,
      helpWithFeesReferenceNumber: undefined,
      paymentDetails: paymentDetailsRequestBody,
    } as unknown as UpdateCaseResponse);
    await PaymentHandler(req, res);
    await new Promise(process.nextTick);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
    expect(req.session.userCase.paymentDetails).toStrictEqual(paymentDetailsRequestBody);
    expect(res.redirect).toHaveBeenCalledWith('/application-submitted');
    expect(req.session.userCase.hwfPaymentSelection).toBeUndefined();
    expect(req.session.userCase.helpWithFeesReferenceNumber).toBeUndefined();
  });

  test('Should redirect to gov pay if next url present and payment not successful', async () => {
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
    await PaymentHandler(req, res);
    expect(req.session.save).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/payment');
  });

  test('Should throw error and redirect if no next url present', async () => {
    req.session.userCase.edgeCaseTypeOfApplication = 'PO' as TYPE_OF_APPLICATION;
    const paymentDetailsRequestBody = {
      payment_reference: 'a',
      date_created: 'b',
      external_reference: 'c',
      next_url: undefined,
      status: 'failure',
      serviceRequestReference: 'e',
    };
    mockedAxios.post.mockRejectedValue({
      data: {
        ...paymentDetailsRequestBody,
      },
    });
    req.session.errors = [];
    await PaymentHandler(req, res);
    await new Promise(process.nextTick);

    expect(req.session.save).toHaveBeenCalled();
    expect(req.session.errors).toStrictEqual([{ errorType: 'errorPaymentRedirect', propertyName: '*' }]);
    expect(req.session.paymentError).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
  });

  test('Should throw error and redirect if error thrown', async () => {
    req.session.userCase = undefined;
    await PaymentHandler(req, res);
    expect(req.session.paymentError).toStrictEqual({ hasError: true, errorContext: 'defaultPaymentError' });
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
  });
});

describe('PaymentValidationHandler', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    req.locals.logger = mockLogger;
    req.session.user.accessToken = mockToken;
    req.session.userCase.id = dummyCaseID;
    // req.protocol = 'http';
    req.headers.host = 'localhost:3001';
    req.session.userCase.paymentDetails = paymentDetails;
    jest.clearAllMocks();
  });

  const paymentDetails = {
    payment_reference: 'RF32-123',
    date_created: '9-10-2022',
    external_reference: 'N/A',
    next_url: 'http://localhost:3001/payment/reciever/callback/RC-12/Success',
    status: 'Success',
    serviceRequestReference: 'serviceRequestReference',
  };

  test('expecting PaymentValidationHandler Controller', async () => {
    req.params = { status: 'Success', paymentId: 'DUMMY_X100' };
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetails,
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        ...paymentDetails,
      },
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        draftOrderDoc: {
          document_url:
            'http://dm-store-aat.service.core-compute-aat.internal/documents/c9f56483-6e2d-43ce-9de8-72661755b87c',
          document_filename: 'finalDocument.pdf',
          document_binary_url:
            'http://dm-store-aat.service.core-compute-aat.internal/documents/c9f56483-6e2d-43ce-9de8-72661755b87c/binary',
        },
      },
    });
    const mockApi = new CaseApi(mockedAxios, mockLogger);
    req.locals.api = mockApi;
    await PaymentValidationHandler(req, res);
    expect(req.session.paymentError).toStrictEqual({ hasError: false, errorContext: null });
  });

  test('should populate error if payment not a success', async () => {
    req.params = { status: 'Success', paymentId: 'DUMMY_X100' };
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetails,
        status: 'Failed',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        ...paymentDetails,
        status: 'Failed',
      },
    });
    await PaymentValidationHandler(req, res);
    expect(req.session.paymentError).toStrictEqual({ hasError: true, errorContext: 'paymentUnsuccessful' });
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
    expect(mockLogger.error).toHaveBeenCalledWith('Error in retreive payment status');
  });

  test('should catch error', async () => {
    req.params = { status: 'Success', paymentId: 'DUMMY_X100' };
    mockedAxios.get.mockRejectedValueOnce;
    await PaymentValidationHandler(req, res);
    expect(req.session.paymentError).toStrictEqual({ hasError: true, errorContext: 'paymentUnsuccessful' });
    expect(res.redirect).toHaveBeenCalledWith('/pay-your-fee');
    expect(mockLogger.error).toHaveBeenCalledTimes(2);
    expect(mockLogger.error).toHaveBeenCalledWith('Error in retreive payment status');
  });

  test('expecting res 500', async () => {
    req.params = {};
    mockedAxios.post.mockResolvedValue({
      data: {
        ...paymentDetails,
        status: 'Failed',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        ...paymentDetails,
        status: 'Failed',
      },
    });
    const result = await PaymentValidationHandler(req, res);
    expect(result).toBe(undefined);
  });

  test('expecting PaymentValidationHandler Controller check for res status', async () => {
    req.params = {};
    await PaymentValidationHandler(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
  });

  test('expecting submitCase Controller', async () => {
    await submitCase(req, res, CASE_EVENT.SUBMIT_CA_CASE);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.render).toHaveBeenCalledTimes(0);
    expect(res.redirect).toHaveBeenCalledWith('/application-submitted');
  });
});
