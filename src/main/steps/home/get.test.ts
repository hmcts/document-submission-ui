import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { UserDetails } from '../../app/controller/AppRequest';
import { HOME_URL, TYPE_OF_APPLICATION_URL } from '../urls';

import { HomeGetController } from './get';

describe('HomeGetController', () => {
  const controller = new HomeGetController();

  test('redirects to the first question for new users', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          mockQuestion: 'mockExistingAnswer',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to the check your answers page for existing users', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to application sent for review page for applicant 1 users in awaitingApplicant2 state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to confirmation page for applicant 1 users in applicant2Approved state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to application submitted page for applicant 1 users in submitted state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });
  test('redirects to home page', () => {
    const req = mockRequest({
      session: {
        user: {
          id: '123',
        },
      },
    });
    req.session.user = undefined as unknown as UserDetails;
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(HOME_URL);
  });

  test('redirects to the check your answers page for applicant 1 users in awaitingApplicant1Response state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to the pay your fee page for applicant 1 users for sole application in awaitingPayment state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });

  test('redirects to the hub page for applicant 1 users in holding state', () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: '123',
          state: '',
        },
      },
    });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(TYPE_OF_APPLICATION_URL);
  });
});
