/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Response } from 'express';

import { State } from '../../../app/case/CaseApi';
import { CaseWithId } from '../../../app/case/case';
import { CASE_EVENT, PaymentErrorContext, TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { STATEMENT_OF_TRUTH, TYPE_OF_APPLICATION_URL } from '../../../steps/urls';

export const routeGuard = {
  post: async (req: AppRequest, res: Response, next: NextFunction) => {
    const caseData = req.session.userCase;
    const typeOfApplication = caseData?.edgeCaseTypeOfApplication;
    req.session.paymentError = { hasError: false, errorContext: null };
    req.session.errors = [];

    if (
      req.body['applicantStatementOfTruth'] &&
      [TYPE_OF_APPLICATION.FGM, TYPE_OF_APPLICATION.FMPO].includes(typeOfApplication)
    ) {
      try {
        req.session.userCase = (await req.locals.api.updateCase(caseData, CASE_EVENT.SUBMIT_DA_CASE)) as CaseWithId;
      } catch (e) {
        req.locals.logger.error(e);
        req.session.paymentError = { hasError: true, errorContext: PaymentErrorContext.APPLICATION_NOT_SUBMITTED };
        return req.session.save(() => {
          res.redirect(STATEMENT_OF_TRUTH);
        });
      }
    }
    next();
  },
  get: async (req: AppRequest, res: Response, next: NextFunction) => {
    if (req.session.userCase.state === State.CASE_SUBMITTED_PAID) {
      return res.redirect(TYPE_OF_APPLICATION_URL);
    }
    next();
  },
};
