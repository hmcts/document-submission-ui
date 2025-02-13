import { mockRequest } from '../../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../../app/case/CaseApi';

import { routeGuard } from './routeGuard';

const deleteDocumentMock = jest.spyOn(CaseApi.prototype, 'deleteDocument');

describe('upload > upload-your-documents > routeGuard', () => {
  let req;
  let res;
  const next = jest.fn();

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  test('get should delete document from session when id is provided', async () => {
    req.session.userCase.applicantApplicationFormDocuments = [
      {
        document_url: 'test2/1234',
        document_binary_url: 'binary/test2/1234',
        document_filename: 'test_document_1',
      },
      {
        document_url: 'test2/12345',
        document_binary_url: 'binary/test2/12346',
        document_filename: 'test_document_2',
      },
    ];
    req.params = { removeFileId: '1234' };
    deleteDocumentMock.mockResolvedValue();
    await routeGuard.get(req, res, next);
    await new Promise(process.nextTick);

    expect(req.session.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
    expect(req.session.userCase.applicantApplicationFormDocuments).toStrictEqual([
      {
        document_url: 'test2/12345',
        document_binary_url: 'binary/test2/12346',
        document_filename: 'test_document_2',
      },
    ]);
  });

  test('get should call next when no id is provided', async () => {
    await routeGuard.get(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
