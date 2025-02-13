import axios from 'axios';
import config from 'config';
import { LoggerInstance } from 'winston';

import { getServiceAuthToken } from '../../../app/auth/service/get-service-auth-token';
import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { UserDetails } from '../../../app/controller/AppRequest';

export const getApplicationFee = async (
  userDetails: UserDetails,
  edgeCaseApplicationType: TYPE_OF_APPLICATION,
  logger: LoggerInstance
): Promise<FeesResponse | void> => {
  try {
    const url: string = config.get('services.cos.url') + `/fees-and-payment-apis/getFee/${edgeCaseApplicationType}`;
    const response = await axios.get<FeesResponse>(url, {
      headers: {
        Authorization: 'Bearer ' + userDetails.accessToken,
        serviceAuthorization: 'Bearer ' + getServiceAuthToken(),
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 || !response.data?.errorRetrievingResponse) {
      return response.data;
    }
  } catch (err) {
    logger.error(err.message);
    throw new Error('Error occured, fee could not be fetched. - getApplicationFee');
  }
};

export interface FeesResponse {
  feeAmount: string;
  errorRetrievingResponse: string;
}
