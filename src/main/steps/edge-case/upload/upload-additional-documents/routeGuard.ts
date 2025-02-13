import { NextFunction, Response } from 'express';

import { UploadDocumentContext } from '../../../../app/case/definition';
import { AppRequest } from '../../../../app/controller/AppRequest';
import { deleteDocumentAndRedirect } from '../utils';

export const routeGuard = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get: async (req: AppRequest, res: Response, next: NextFunction) => {
    if (req.params?.removeFileId) {
      await deleteDocumentAndRedirect(
        req,
        res,
        req.params?.removeFileId,
        UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
      );
      return;
    }

    next();
  },
};
