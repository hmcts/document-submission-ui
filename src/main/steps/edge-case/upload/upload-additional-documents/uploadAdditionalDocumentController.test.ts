import { mockRequest } from '../../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../../app/case/CaseApi';

import UploadAdditionalDocumentPostController from './uploadAdditionalDocumentPostController';

const uploadDocumentMock = jest.spyOn(CaseApi.prototype, 'uploadDocument');
const updateCaseMock = jest.spyOn(CaseApi.prototype, 'updateCase');

describe('document upload > upload additional documents > post controller', () => {
  let postController;
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    postController = new UploadAdditionalDocumentPostController({});
    jest.clearAllMocks();
  });

  test('post should upload documents to session', async () => {
    req.body.saveAndContinue = false;
    req.body.uploadFile = { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' };
    req.files = { additionalApplicationUpload: { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' } };
    req.session.userCase.applicantAdditionalDocuments = [];
    uploadDocumentMock.mockResolvedValue({
      status: 'Success',
      document: {
        document_url: 'test2/1234',
        document_binary_url: 'binary/test2/1234',
        document_filename: 'test_document_2',
        document_hash: '1234',
        document_creation_date: '1/1/2024',
      },
    });

    await postController.post(req, res);
    await new Promise(process.nextTick);

    expect(req.session.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/upload/upload-additional-documents');
    expect(req.session.userCase.applicantAdditionalDocuments).toStrictEqual([
      {
        document_url: 'test2/1234',
        document_binary_url: 'binary/test2/1234',
        document_filename: 'test_document_2',
        document_hash: '1234',
        document_creation_date: '1/1/2024',
      },
    ]);
  });

  test('post should redirect to check your answers page if saveAndContinue is true and documents uploaded', async () => {
    req.body.saveAndContinue = true;
    req.session.userCase.applicantAdditionalDocuments = [
      {
        document_url: 'test2/1234',
        document_binary_url: 'binary/test2/1234',
        document_filename: 'test_document_2',
        document_hash: '1234',
        document_creation_date: '1/1/2024',
      },
    ];
    updateCaseMock.mockResolvedValue(req.session.userCase);

    await postController.post(req, res);
    await new Promise(process.nextTick);

    expect(req.session.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/check-your-answers');
  });
});
