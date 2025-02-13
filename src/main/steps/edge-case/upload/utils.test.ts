import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { CaseApi } from '../../../app/case/CaseApi';
import { UploadDocumentContext } from '../../../app/case/definition';

import { deleteDocumentAndRedirect, handleDocumentUpload } from './utils';

const uploadDocumentMock = jest.spyOn(CaseApi.prototype, 'uploadDocument');
const deleteDocumentMock = jest.spyOn(CaseApi.prototype, 'deleteDocument');

describe('document upload > utils', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    req.session.errors = [];
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('handleDocumentUpload', () => {
    test('should upload document and save it in session', async () => {
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

      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
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

    test('should upload document and save it in session for additional documents', async () => {
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

      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS);
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

    test('should add error to session when no files uploaded', async () => {
      req.files = null;
      req.session.userCase.applicantApplicationFormDocuments = [];
      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'noFileUploadError',
          propertyName: 'applicationUpload',
        },
      ]);
    });

    test('should add error to session when file type is invalid', async () => {
      req.session.userCase.applicantApplicationFormDocuments = [];
      req.files = { applicationUpload: { name: 'test.jpg', data: '', mimetype: 'mp3', size: '123' } };
      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'formatError',
          propertyName: 'applicationUpload',
        },
      ]);
    });

    test('should add error to session when file is too large', async () => {
      req.files = { applicationUpload: { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '12345678910' } };
      req.session.userCase.applicantApplicationFormDocuments = [{ document_url: 'test2/1234' }];
      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'sizeError',
          propertyName: 'applicationUpload',
        },
      ]);
    });

    test('should add error to session when too many files uploaded', async () => {
      req.files = { applicationUpload: { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' } };
      req.session.userCase.applicantApplicationFormDocuments = [
        { document_url: 'test1/1234' },
        { document_url: 'test2/1234' },
        { document_url: 'test3/1234' },
        { document_url: 'test4/1234' },
        { document_url: 'test5/1234' },
      ];
      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'totalFilesExceededError',
          propertyName: 'applicationUpload',
        },
      ]);
    });

    test('should add error to session when error uploading document', async () => {
      req.session.userCase.applicantApplicationFormDocuments = [{ document_url: 'test2/1234' }];
      req.files = { applicationUpload: { name: 'test.jpg', data: '', mimetype: 'image/jpeg', size: '123' } };
      uploadDocumentMock.mockRejectedValue({ status: 'Failure' });
      await handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'uploadError',
          propertyName: 'applicationUpload',
        },
      ]);
    });
  });

  describe('deleteDocumentAndRedirect', () => {
    test('should delete document from session', async () => {
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
      deleteDocumentMock.mockResolvedValue();
      await deleteDocumentAndRedirect(req, res, '1234', UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
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

    test('should delete document from session for additional documents', async () => {
      req.session.userCase.applicantAdditionalDocuments = [
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
      deleteDocumentMock.mockResolvedValue();
      await deleteDocumentAndRedirect(req, res, '1234', UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-additional-documents');
      expect(req.session.userCase.applicantAdditionalDocuments).toStrictEqual([
        {
          document_url: 'test2/12345',
          document_binary_url: 'binary/test2/12346',
          document_filename: 'test_document_2',
        },
      ]);
    });

    test('should catch error and add it to session', async () => {
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
      deleteDocumentMock.mockRejectedValueOnce({ status: 'Failure' });
      await deleteDocumentAndRedirect(req, res, '1234', UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/upload/upload-your-documents');
      expect(req.session.errors).toStrictEqual([
        {
          errorType: 'deleteError',
          propertyName: 'applicationUpload',
        },
      ]);
    });
  });
});
