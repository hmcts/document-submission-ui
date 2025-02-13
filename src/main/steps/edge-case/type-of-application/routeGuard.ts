import { NextFunction, Response } from 'express';

import { CaseWithId } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';

export const routeGuard = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  post: async (req: AppRequest, res: Response, next: NextFunction) => {
    if (req.body?.edgeCaseTypeOfApplication !== req.session?.userCase?.edgeCaseTypeOfApplication) {
      req.session.userCase = {
        edgeCaseTypeOfApplication: req.body.edgeCaseTypeOfApplication,
      } as CaseWithId;

      return req.session.save(next);
    }
    next();
  },
};
