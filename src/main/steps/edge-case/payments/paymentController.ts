import config from 'config';
import { Response } from 'express';

import { CaseWithId } from '../../../app/case/case';
import { CASE_EVENT, PaymentErrorContext, TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { applyParms } from '../../../steps/common/url-parser';
import { APPLICATION_SUBMITTED, CREATE_PAYMENT, GET_PAYMENT_STATUS, PAY_YOUR_FEE } from '../../../steps/urls';
import { getEnumKeyByValue } from '../util';

import { CheckPaymentStatusApi, PaymentTaskResolver } from './paymentApi';
import { PaymentHelper } from './paymentHelper';
const SUCCESS = 'Success';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const PaymentHandler = async (req: AppRequest, res: Response) => {
  try {
    if (!req.body['saveAndContinue']) {
      delete req.session.userCase.helpWithFeesReferenceNumber;
      delete req.session.userCase.hwfPaymentSelection;
    }

    const paymentHelperTranspiler = await new PaymentHelper().SystemCredentailsToApiData(req);
    const { Authorization, ServiceAuthorization, returnUrL, id, hwfRefNumber } = paymentHelperTranspiler;
    const paymentApiEndpoint = config.get('services.cos.url');
    const baseURL = paymentApiEndpoint + CREATE_PAYMENT;

    const paymentCreator = new PaymentTaskResolver(
      baseURL,
      Authorization,
      ServiceAuthorization,
      id,
      returnUrL,
      hwfRefNumber as string,
      getEnumKeyByValue(TYPE_OF_APPLICATION, req.session.userCase.edgeCaseTypeOfApplication)
    );
    const response = await paymentCreator.getPaymentCredentails();

    req.session.userCase.paymentDetails = response;
    //if previous payment is success then invoke submit case else redirect gov.uk
    //if help with fees opted then submit case & redirect to confirmation page
    if (hwfRefNumber && response?.serviceRequestReference) {
      //help with fess, submit case without payment
      submitCase(req, res, CASE_EVENT.SUBMIT_CA_CASE_WITH_HWF);
    } else if (response?.serviceRequestReference && response?.payment_reference && response?.status === SUCCESS) {
      //previous payment is success, retry submit case with 'citizen-case-submit' & reidrect confirmation page
      submitCase(req, res, CASE_EVENT.SUBMIT_CA_CASE);
    } else if (response['next_url']) {
      //redirect to gov pay for making payment
      res.redirect(response['next_url']);
    } else {
      //redirect to payment with error
      req.locals.logger.error('Error in create service request/payment reference');
      req.session.errors.push({ errorType: 'errorPaymentRedirect', propertyName: '*' });
      req.session.save(() => {
        res.redirect(PAY_YOUR_FEE);
      });
    }
  } catch (e) {
    req.locals.logger.error(e);
    populateError(
      req,
      res,
      'Error in create service request/payment reference',
      PaymentErrorContext.DEFAULT_PAYMENT_ERROR
    );
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const PaymentValidationHandler = async (req: AppRequest, res: Response) => {
  if (!req.params.hasOwnProperty('status') && !req.params.hasOwnProperty('paymentId')) {
    res.status(500);
  } else {
    try {
      const { id } = req.session.userCase;
      const paymentReference = req.session.userCase?.paymentDetails?.payment_reference;
      const PaymentURL =
        config.get('services.cos.url') +
        applyParms(GET_PAYMENT_STATUS, {
          paymentReference: paymentReference!,
          caseId: id,
        });
      const paymentHelperTranspiler = await new PaymentHelper().SystemCredentailsToApiData(req);
      const { Authorization, ServiceAuthorization } = paymentHelperTranspiler;
      const checkPayment = await new CheckPaymentStatusApi(PaymentURL, Authorization, ServiceAuthorization)
        .PaymentStatusInstance()
        .get('');
      const paymentStatus = checkPayment['data']['status'];
      if (paymentStatus && paymentStatus === SUCCESS) {
        req.session.userCase.paymentSuccessDetails = checkPayment['data'];
        //Invoke update case with 'citizen-case-submit' event & reidrect confirmation page
        submitCase(req, res, CASE_EVENT.SUBMIT_CA_CASE);
      } else {
        populateError(req, res, 'Error in retreive payment status', PaymentErrorContext.PAYMENT_UNSUCCESSFUL);
      }
    } catch (error) {
      req.locals.logger.error(error);
      populateError(req, res, 'Error in retreive payment status', PaymentErrorContext.PAYMENT_UNSUCCESSFUL);
    }
  }
};

export async function submitCase(req: AppRequest, res: Response, eventName: CASE_EVENT): Promise<void> {
  try {
    req.session.paymentError = { hasError: false, errorContext: null };
    req.session.userCase = (await req.locals.api.updateCase(req.session.userCase, eventName)) as CaseWithId;
    //save & redirect to confirmation page
    req.session.save(() => {
      res.redirect(APPLICATION_SUBMITTED);
    });
  } catch (e) {
    req.locals.logger.error(e);
    populateError(req, res, 'Error in submit case', PaymentErrorContext.APPLICATION_NOT_SUBMITTED);
  }
}

const populateError = (req: AppRequest, res: Response, errorMsg: string, errorContext: PaymentErrorContext) => {
  req.locals.logger.error(errorMsg);
  req.session.paymentError = { hasError: true, errorContext };
  req.session.save(() => {
    res.redirect(PAY_YOUR_FEE);
  });
};
