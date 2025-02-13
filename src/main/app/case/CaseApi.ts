/* eslint-disable @typescript-eslint/no-shadow */
import https from 'https';

import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import FormData from 'form-data';
import { LoggerInstance } from 'winston';

import { getServiceAuthToken } from '../auth/service/get-service-auth-token';
import { UserDetails } from '../controller/AppRequest';

import {
  CreateCaseResponse,
  UpdateCaseRequest,
  UpdateCaseResponse,
  mapCreateCaseResponseData,
  mapUpdateCaseResponseData,
  prepareCaseRequestData,
  prepareUpdateCaseRequestData,
} from './api-utility';
import { CaseWithId } from './case';
import { CaseData, CourtListOptions, DocumentUploadResponse } from './definition';

export class CaseApi {
  /**
   *
   * @param axios
   * @param logger
   */
  constructor(private readonly axios: AxiosInstance, private readonly logger: LoggerInstance) {}

  /**
   *
   * @param userCase
   * @returns
   */
  public async createCase(userCase: CaseWithId): Promise<CreateCaseResponse> {
    try {
      if (!userCase?.edgeCaseTypeOfApplication) {
        throw new Error('createCase - error in creating case. case type is missing.');
      }

      const request = prepareCaseRequestData(userCase);
      const response = await this.axios.post<CreateCaseResponse, AxiosResponse<CaseData>>('/case/create', request, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (response.status === 200) {
        return mapCreateCaseResponseData(response.data);
      }
      throw new Error('createCase - error in creating case. case could not be created.');
    } catch (err) {
      this.logError(err);
      throw new Error('createCase - error in creating case. case could not be created.');
    }
  }

  /**
   *
   * @param req
   * @param userDetails
   * @param  formData
   * @returns
   */
  public async updateCase(userCase: CaseWithId, eventName: string): Promise<UpdateCaseResponse> {
    try {
      if (!userCase?.id) {
        throw new Error('updateCase - error in updating case. case id is missing.');
      }

      const response = await this.axios.post<UpdateCaseRequest, AxiosResponse<CaseData>>(
        `${userCase.id}/${eventName}/update-dss-case`,
        prepareUpdateCaseRequestData(userCase),
        {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      if (response.status === 200) {
        return mapUpdateCaseResponseData(response.data);
      }
      throw new Error('updateCase - error in updating case. case could not be updated.');
    } catch (err) {
      this.logError(err);
      throw new Error('updateCase - error in updating case. case could not be updated.');
    }
  }

  /**
   *
   * @returns
   */
  public async getCourtList(): Promise<CourtListOptions[]> {
    try {
      const response = await this.axios.get('/edge-case/court-list');
      return response.data;
    } catch (err) {
      this.logError(err);
      throw new Error('getCourtList - court list could not be fetched.');
    }
  }

  /**
   *
   * @param error
   */
  private logError(error: AxiosError) {
    if (error.response) {
      this.logger.error(
        `API Error ${error.response.config.method} ${error.response.config.url} ${error.response.status}`
      );
      this.logger.info('Response: ', error.response.data);
    } else if (error.request) {
      this.logger.error(`API Error ${error.request.config.method} ${error.request.config.url}`);
    } else {
      this.logger.error('API Error', error.message);
    }
  }

  public async uploadDocument(formdata: FormData): Promise<DocumentUploadResponse> {
    try {
      const response = await this.axios.post<DocumentUploadResponse>('/upload-citizen-document', formdata, {
        headers: {
          ...formdata.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (response.status === 200) {
        return { document: response.data.document, status: response.data.status };
      }
      throw new Error('Document could not be uploaded.');
    } catch (err) {
      this.logError(err);
      throw new Error('Document could not be uploaded.');
    }
  }

  public async deleteDocument(docId: string): Promise<void> {
    try {
      const response = await this.axios.delete<void>(`/${docId}/delete`);
      if (response.status === 200) {
        return;
      }
      throw new Error('Document could not be deleted.');
    } catch (err) {
      this.logError(err);
      throw new Error('Document could not be deleted.');
    }
  }
}

/**
 *
 * @param userDetails
 * @param logger
 * @returns
 */
export const getCaseApi = (userDetails: UserDetails, logger: LoggerInstance): CaseApi => {
  return new CaseApi(
    Axios.create({
      baseURL: config.get('services.cos.url'),
      headers: {
        Authorization: 'Bearer ' + userDetails.accessToken,
        ServiceAuthorization: 'Bearer ' + getServiceAuthToken(),
        experimental: 'true',
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    }),
    logger
  );
};

export const enum State {
  CASE_DRAFT = 'AWAITING_SUBMISSION_TO_HMCTS',
  CASE_SUBMITTED_PAID = 'SUBMITTED_PAID',
  CASE_SUBMITTED_NOT_PAID = 'SUBMITTED_NOT_PAID',
  CASE_ISSUED_TO_LOCAL_COURT = 'CASE_ISSUE',
  CASE_GATE_KEEPING = 'GATE_KEEPING',
  CASE_CLOSED = 'ALL_FINAL_ORDERS_ISSUED',
  CASE_SERVED = 'PREPARE_FOR_HEARING_CONDUCT_HEARING',
  CASE_WITHDRAWN = 'CASE_WITHDRAWN',
  CASE_DELETED = 'REQUESTED_FOR_DELETION',
}
