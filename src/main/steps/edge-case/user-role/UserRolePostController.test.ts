import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { UserRole } from '../../../app/case/definition';
import { FormFieldsFn } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import * as steps from '../../../steps';
import { DATE_OF_BIRTH, FULL_NAME } from '../../urls';

import { UserRolePostController } from './userRolePostController';

const getNextStepUrlMock = jest.spyOn(steps, 'getNextStepUrl');

describe('UserRolePostController', () => {
  afterEach(() => {
    getNextStepUrlMock.mockClear();
  });

  test('Should redirect back to the current page with the form data on errors', async () => {
    const errors = [{ errorType: 'required', propertyName: 'whomYouAreApplying' }];
    const mockForm = {
      fields: {
        whomYouAreApplying: {
          type: 'radios',
          values: [
            { label: l => l.self, value: UserRole.SELF },
            { label: l => l.forSomeone, value: UserRole.FOR_SOMEONE },
          ],
          validator: isFieldFilledIn,
        },
      },
      submit: {
        text: l => l.continue,
      },
    };
    const controller = new UserRolePostController(mockForm.fields);

    const req = mockRequest({});
    const res = mockResponse();
    await controller.post(req, res);

    expect(getNextStepUrlMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  test('Should redirect to the date of birth page when self radio button selected', async () => {
    const mockForm = {
      fields: {
        whomYouAreApplying: {
          type: 'radios',
          values: [
            { label: l => l.self, value: UserRole.SELF },
            { label: l => l.forSomeone, value: UserRole.FOR_SOMEONE },
          ],
          validator: isFieldFilledIn,
        },
      },
      submit: {
        text: l => l.continue,
      },
    };
    const controller = new UserRolePostController(mockForm.fields);

    const body = { whomYouAreApplying: 'self' };

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(getNextStepUrlMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(DATE_OF_BIRTH);
  });

  test('Should redirect to full name page when for someone radio button selected', async () => {
    const mockForm = {
      fields: () => ({
        whomYouAreApplying: {
          type: 'radios',
          values: [
            { label: l => l.self, value: UserRole.SELF },
            { label: l => l.forSomeone, value: UserRole.FOR_SOMEONE },
            { label: l => l.forCourtStaff, value: UserRole.COURT_STAFF },
          ],
          validator: isFieldFilledIn,
        },
      }),
      submit: {
        text: l => l.continue,
      },
    };
    const controller = new UserRolePostController(mockForm.fields as FormFieldsFn);

    const body = { whomYouAreApplying: 'forSomeone' };

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(getNextStepUrlMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(FULL_NAME);
  });
});
