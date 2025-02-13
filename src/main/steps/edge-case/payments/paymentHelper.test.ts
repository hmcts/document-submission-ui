import { mockRequest } from '../../../../test/unit/utils/mockRequest';

import { PaymentHelper } from './paymentHelper';

const mockToken = 'authToken';

const dummyCaseID = '2122323';

const InstanceOfPaymentHelper = new PaymentHelper();
describe('PaymentHelper', () => {
  const req = mockRequest({});

  req.session.user.accessToken = mockToken;
  req.session.userCase.id = dummyCaseID;
  req.headers.host = 'localhost:3001';
  test('Should match the output values corresponding to given input', async () => {
    const generateMockSystemCredential = await InstanceOfPaymentHelper.SystemCredentailsToApiData(req);

    expect(generateMockSystemCredential.Authorization).toEqual(mockToken);
    expect(generateMockSystemCredential.id).toEqual(dummyCaseID);
  });

  test('Shouldn"t match the output values corresponding to given input', async () => {
    const generateMockSystemCredential = await InstanceOfPaymentHelper.SystemCredentailsToApiData(req);

    expect(generateMockSystemCredential).not.toEqual({
      Authorization: '',
      ServiceAuthorization: '',
      applicantCaseName: '',
      caseId: '',
      returnUrL: '',
      hwfRefNumber: '',
    });
  });
});
