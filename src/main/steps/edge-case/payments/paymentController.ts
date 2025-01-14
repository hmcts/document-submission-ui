import config from 'config';
import { Response } from 'express';

import { CheckPaymentStatusApi, PaymentTaskResolver } from './paymentApi';
import { PaymentHelper } from './paymentHelper';
import { APPLICATION_SUBMITTED, PAY_YOUR_FEE } from '../../../steps/urls';
import { AppRequest } from '../../../app/controller/AppRequest';
import { CASE_EVENT, PaymentErrorContext, TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { Case } from '../../../app/case/case';
import { getEnumKeyByValue } from '../util';
const SUCCESS = 'Success';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const PaymentHandler = async (req: AppRequest, res: Response) => {
  try {
    const paymentHelperTranspiler = await new PaymentHelper().SystemCredentailsToApiData(req);
    const { Authorization, ServiceAuthorization, returnUrL, id, hwfRefNumber } = paymentHelperTranspiler;
    const paymentApiEndpoint = config.get('services.cos.url');
    const createPaymentEndpoint = '/fees-and-payment-apis/create-payment';
    const baseURL = paymentApiEndpoint + createPaymentEndpoint;

    const paymentCreator = new PaymentTaskResolver(
      baseURL,
      Authorization,
      ServiceAuthorization,
      id,
      returnUrL,
      hwfRefNumber as string,
      getEnumKeyByValue(TYPE_OF_APPLICATION, req.session.userCase.typeOfApplication),
    );
    const response = await paymentCreator.getPaymentCredentails();

    req.session.userCase.paymentDetails = response;
    //if previous payment is success then invoke submit case else redirect gov.uk
    //if help with fees opted then submit case & redirect to confirmation page
    if (hwfRefNumber && response?.serviceRequestReference) {
      //help with fess, submit case without payment
      submitCase(
        req,
        res,
        req.session.userCase.id!,
        req.session.userCase,
        req.originalUrl,
        CASE_EVENT.CASE_SUBMIT_WITH_HWF
      );
    } else if (response?.serviceRequestReference && response?.payment_reference && response?.status === SUCCESS) {
      //previous payment is success, retry submit case with 'citizen-case-submit' & reidrect confirmation page
      submitCase(
        req,
        res,
        req.session.userCase.id!,
        req.session.userCase,
        req.originalUrl,
        CASE_EVENT.CASE_SUBMIT
      );
    } else if (response['next_url']) {
      //redirect to gov pay for making payment
      res.redirect(response['next_url']);
    } else {
      //redirect to check your answers with error
      populateError(
        req,
        res,
        'Error in create service request/payment reference',
        PaymentErrorContext.DEFAULT_PAYMENT_ERROR
      );
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
      const PaymentURL =
        config.get('services.cos.url') +
        `/fees-and-payment-apis/retrievePaymentStatus/${req.session.userCase?.paymentDetails?.['payment_reference']}/${id}`;
      const paymentHelperTranspiler = await new PaymentHelper().SystemCredentailsToApiData(req);
      const { Authorization, ServiceAuthorization } = paymentHelperTranspiler;
      const checkPayment = await new CheckPaymentStatusApi(PaymentURL, Authorization, ServiceAuthorization)
        .PaymentStatusInstance()
        .get('');
      const paymentStatus = checkPayment['data']['status'];
      if (paymentStatus && paymentStatus === SUCCESS) {
        req.session.userCase.paymentSuccessDetails = checkPayment['data'];
        //Invoke update case with 'citizen-case-submit' event & reidrect confirmation page
        submitCase(
          req,
          res,
          req.session.userCase.id!,
          req.session.userCase,
          req.originalUrl,
          CASE_EVENT.CASE_SUBMIT
        );
      } else {
        populateError(req, res, 'Error in retreive payment status', PaymentErrorContext.PAYMENT_UNSUCCESSFUL);
      }
    } catch (error) {
      req.locals.logger.error(error);
      populateError(req, res, 'Error in retreive payment status', PaymentErrorContext.PAYMENT_UNSUCCESSFUL);
    }
  }
};

export async function submitCase(
  req: AppRequest,
  res: Response,
  caseId: string,
  caseData: Partial<Case>,
  returnUrl: string,
  caseEvent: CASE_EVENT
): Promise<void> {
  try {
    req.session.paymentError = { hasError: false, errorContext: null };
    const updatedCase = await req.locals.api.updateCase(req, caseEvent);
    //update final document in session for download on confirmation
    console.log('updated case {}', updatedCase);
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
