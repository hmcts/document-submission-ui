import axios from 'axios';
import FormData from 'form-data';
import { LoggerInstance } from 'winston';

import { mockUserCase1 } from '../../../test/unit/utils/mockUserCase';

import { CaseApi } from './CaseApi';

jest.mock('axios');
const mockLogger = {
  error: jest.fn().mockImplementation((message: string) => message),
  info: jest.fn().mockImplementation((message: string) => message),
} as unknown as LoggerInstance;

test('Should throw error when case could not be fetched', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockRejectedValue({
    config: { method: 'GET', url: 'https://example.com' },
    request: 'mock request',
  });
  const userCase = { ...mockUserCase1, edgeCaseTypeOfApplication: 'FMPO' };
  const api = new CaseApi(axios, mockLogger);
  await expect(api.createCase(userCase)).rejects.toThrowError(
    'createCase - error in creating case. case could not be created'
  );
});

test('Should throw error when edgeCaseTypeOfApplication is missing', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue({
    status: '200',
    data: {
      case_users: [
        {
          case_id: '1624351572550045',
          user_id: '372ff9c1-9930-46d9-8bd2-88dd26ba2475',
          case_role: '[APPLICANTTWO]',
        },
      ],
    },
  });
  const userCase = mockUserCase1;
  const api = new CaseApi(axios, mockLogger);
  await expect(api.createCase(userCase)).rejects.toThrowError(
    'createCase - error in creating case. case could not be created'
  );
});

test('Should throw error when case could not be updated', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockRejectedValue({
    config: { method: 'GET', url: 'https://example.com' },
    request: 'mock request',
  });
  const userCase = { ...mockUserCase1, id: '1' };
  const api = new CaseApi(axios, mockLogger);
  await expect(api.updateCase(userCase, '')).rejects.toThrowError(
    'updateCase - error in updating case. case could not be updated.'
  );
});

test('Should throw error when case could not be submitted', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockRejectedValue({
    config: { method: 'GET', url: 'https://example.com' },
    request: 'mock request',
  });
  const userCase = { ...mockUserCase1, id: '1' };
  const api = new CaseApi(axios, mockLogger);
  await expect(api.updateCase(userCase, 'CITIZEN_SUBMIT')).rejects.toThrowError(
    'updateCase - error in updating case. case could not be updated.'
  );
});

test('Should throw error when id is missing', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue({
    status: '200',
    data: {
      case_users: [
        {
          case_id: '1624351572550045',
          user_id: '372ff9c1-9930-46d9-8bd2-88dd26ba2475',
          case_role: '[APPLICANTTWO]',
        },
      ],
    },
  });
  const userCase = mockUserCase1;
  const api = new CaseApi(axios, mockLogger);
  await expect(api.updateCase(userCase, 'CITIZEN_SUBMIT')).rejects.toThrowError(
    'updateCase - error in updating case. case could not be updated.'
  );
});

test('Should throw error when court cannot be fetched', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockRejectedValue({
    config: { method: 'GET', url: 'https://example.com' },
  });
  const api = new CaseApi(axios, mockLogger);
  await expect(api.getCourtList()).rejects.toThrowError('getCourtList - court list could not be fetched.');
});

test('Should fail to delete document', async () => {
  const formData = new FormData();
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockRejectedValueOnce;
  const api = new CaseApi(axios, mockLogger);
  await expect(api.uploadDocument(formData)).rejects.toThrowError('Document could not be uploaded.');
});
test('Should fail to upload document', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockRejectedValueOnce;
  const api = new CaseApi(axios, mockLogger);
  await expect(api.deleteDocument('')).rejects.toThrowError('Document could not be deleted.');
});
