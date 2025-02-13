import { NextFunction, Response } from 'express';

import { State } from '../../../app/case/CaseApi';
import { Case } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';
import { getApplicationFee } from '../../../steps/edge-case/fees/fees-lookup-api';
import { TYPE_OF_APPLICATION_URL } from '../../../steps/urls';

export const routeGuard = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get: async (req: AppRequest, res: Response, next: NextFunction) => {
    if (req.session.userCase.state === State.CASE_SUBMITTED_PAID) {
      res.redirect(TYPE_OF_APPLICATION_URL);
    }

    if (req.session.paymentError?.hasError === true) {
      req.session.errors = [];
    }

    try {
      req.session.errors = req.session.errors?.filter(error => error.errorType !== 'errorFetchingFee');
      await retriveFeeAmount(req, next);
    } catch {
      console.log('failed to fetch fee details');
    }
  },
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const retriveFeeAmount = async (req: AppRequest<Partial<Case>>, next: NextFunction) => {
  try {
    const applicationFee = (
      await getApplicationFee(req.session.user, req.session.userCase.edgeCaseTypeOfApplication, req.locals.logger)
    )?.feeAmount;

    if (applicationFee) {
      Object.assign(req.session.userCase, { applicationFee });
      return req.session.save(next);
    }

    next();
  } catch {
    req.session.paymentError = { hasError: false, errorContext: null };
    req.session.errors = [{ errorType: 'errorFetchingFee', propertyName: '*' }];
    req.session.save(next);
  }
};
