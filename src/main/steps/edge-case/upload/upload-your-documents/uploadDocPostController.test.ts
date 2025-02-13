import { mockRequest } from '../../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../../app/case/CaseApi';

import UploadDocumentController from './uploadDocPostController';

const uploadDocumentMock = jest.spyOn(CaseApi.prototype, 'uploadDocument');
const updateCaseMock = jest.spyOn(CaseApi.prototype, 'updateCase');

describe('document upload > upload your documents > post controller', () => {
  let postController;
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    postController = new UploadDocumentController({});
    jest.clearAllMocks();
  });

  test('post should upload documents to session', async () => {
    req.body.saveAndContinue = false;
    req.body.uploadFile = { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' };
    req.files = { applicationUpload: { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' } };
    req.session.userCase.applicantApplicationFormDocuments = [];
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
    expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
    expect(req.session.userCase.applicantApplicationFormDocuments).toStrictEqual([
      {
        document_url: 'test2/1234',
        document_binary_url: 'binary/test2/1234',
        document_filename: 'test_document_2',
        document_hash: '1234',
        document_creation_date: '1/1/2024',
      },
    ]);
  });

  test('post should redirect to additional documents upload page if saveAndContinue is true and documents uploaded', async () => {
    req.body.saveAndContinue = true;
    req.session.userCase.applicantApplicationFormDocuments = [
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
    expect(res.redirect).toHaveBeenCalledWith('/upload/upload-additional-documents');
  });

  test('post should add error to session if continue without document', async () => {
    req.body.saveAndContinue = true;
    req.session.userCase.applicantApplicationFormDocuments = [];
    await postController.post(req, res);

    expect(req.session.errors).toEqual([
      {
        errorType: 'continueWithoutUploadError',
        propertyName: 'applicationUpload',
      },
    ]);
    expect(req.session.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
  });
});
