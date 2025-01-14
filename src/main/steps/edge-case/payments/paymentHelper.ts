import { getServiceAuthToken } from '../../../app/auth/service/get-service-auth-token';
import { CaseWithId } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';
import { PAYMENT_RETURN_URL } from '../../../steps/urls';

/* A type that is used to define the shape of the object that is returned from the function. */
type ISystemCredentailsToApiData = {
  Authorization: string;
  ServiceAuthorization: string;
  returnUrL: string;
  id: string;
  hwfRefNumber: CaseWithId['helpWithFeesReferenceNumber'];
};

/* The class is used to get the data needed to make a payment to the api */
export class PaymentHelper {
  SystemCredentailsToApiData = async (req: AppRequest): Promise<ISystemCredentailsToApiData> => {
    let { id } = req.session.userCase;
    const { helpWithFeesReferenceNumber } = req.session.userCase;
    const { accessToken } = req.session.user;
    const returnURL = `${req.protocol}://${req.headers.host}${PAYMENT_RETURN_URL}`;
    let token = '';
    id = id + '';
    try {
      const ServiceAuthToken = await getServiceAuthToken();
      token = ServiceAuthToken;
    } catch (error) {
      req.locals.logger.error(error);
    }
    return {
      Authorization: accessToken,
      ServiceAuthorization: token,
      returnUrL: returnURL,
      id,
      hwfRefNumber: helpWithFeesReferenceNumber,
    };
  };
}
