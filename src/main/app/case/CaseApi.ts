import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { getServiceAuthToken } from '../auth/service/get-service-auth-token';
import { AppRequest, UserDetails } from '../controller/AppRequest';

import { Case, CaseWithId } from './case';
import { CaseAssignedUserRoles } from './case-roles';
import { CaseData } from './definition';
import { toApiFormat } from './to-api-format';


export class CaseApi {
  /**
   *
   * @param axios
   * @param logger
   */
  constructor(private readonly axios: AxiosInstance, private readonly logger: LoggerInstance) {}

  /**
   *
   * @returns
   */
  public async getOrCreateCase(): Promise<any> {
    return { id: '', state: 'FIS' };
  }

  /**
   *
   * @param req
   * @param userDetails
   * @param formData
   * @returns
   */
  public async getOrCreateCaseNew(req: AppRequest, userDetails: UserDetails,res: Response): Promise<CaseWithId> {
    return this.createCaseNew(req, userDetails);
  }

  /**
   *
   * @param caseId
   * @returns
   */
  public async getCaseById(): Promise<CaseWithId> {
    return new Promise(() => {
      null;
    });
  }

  /**
   *
   * @param req
   * @param userDetails
   * @param  formData
   * @returns
   */
  public async createCaseNew(req: AppRequest, userDetails: UserDetails): Promise<any> {
    try {
      const url: string = config.get('services.createcase.url');
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + userDetails.accessToken };
      console.log('headers:', headers);
      const res: AxiosResponse<createCaseResponse> = await Axios.post(url, mapCaseData(req), { headers });

      console.log('Response:', res.status);
      if (res.status === 200) {
        return { id: res.data.id };
      } 
    } catch (err) {
      console.log('Error in creating case');
      console.log(err);
      window.alert(err.statusCode + ':' + err.status);
     
    }
  }

  /**
   *
   * @param caseId
   * @param userId
   * @returns
   */
  public async getCaseUserRoles(caseId: string, userId: string): Promise<CaseAssignedUserRoles> {
    try {
      const response = await this.axios.get<CaseAssignedUserRoles>(`case-users?case_ids=${caseId}&user_ids=${userId}`);
      return response.data;
    } catch (err) {
      this.logError(err);
      throw new Error('Case roles could not be fetched.');
    }
  }

  /**
   *
   * @param caseId
   * @param data
   * @param eventName
   * @returns
   */
  private async sendEvent(caseId: string, data: Partial<CaseData>, eventName: string): Promise<CaseWithId> {
    console.log({ caseId, data, eventName });
    return new Promise(() => {
      null;
    });
  }

  /**
   *
   * @param caseId
   * @param userData
   * @param eventName
   * @returns
   */
  public async triggerEvent(caseId: string, userData: Partial<Case>, eventName: string): Promise<CaseWithId> {
    const data = toApiFormat(userData);
    return this.sendEvent(caseId, data, eventName);
  }

  /**
   *
   * @param error
   */
  private logError(error: AxiosError) {
    if (error.response) {
      this.logger.error(`API Error ${error.config.method} ${error.config.url} ${error.response.status}`);
      this.logger.info('Response: ', error.response.data);
    } else if (error.request) {
      this.logger.error(`API Error ${error.config.method} ${error.config.url}`);
    } else {
      this.logger.error('API Error', error.message);
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
      baseURL: config.get('services.createcase.url'),
      headers: {
        Authorization: 'Bearer ' + userDetails.accessToken,
        ServiceAuthorization: getServiceAuthToken(),
        experimental: 'true',
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    }),
    logger
  );
};

interface createCaseResponse {
  status: string;
  id: string;
}

export const mapCaseData = (req: AppRequest): any => {
  const data = {
    applicantFirstName: req.session.userCase.applicantFirstName,
    applicantLastName: req.session.userCase.applicantLastName,
    applicantDateOfBirth: req.session.userCase.applicantDateOfBirth,
    applicantEmailAddress: req.session.userCase.applicantEmailAddress,
    applicantPhoneNumber: req.session.userCase.applicantPhoneNumber,
    applicantHomeNumber: req.session.userCase.applicantHomeNumber,
    applicantAddress1: req.session.userCase.applicantAddress1,
    applicantAddress2: req.session.userCase.applicantAddress2,
    applicantAddressTown: req.session.userCase.applicantAddressTown,
    applicantAddressCountry: req.session.userCase.applicantAddressCountry,
    applicantAddressPostCode: req.session.userCase.applicantAddressPostcode,
  };
  console.log('Data:', data);
  return data;
};
