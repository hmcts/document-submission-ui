/* eslint-disable @typescript-eslint/no-unused-vars */
import autobind from 'autobind-decorator';
import { Response } from 'express';

import { UploadDocumentContext } from '../../../../app/case/definition';
import { AppRequest } from '../../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../../app/controller/PostController';
import { FormFields, FormFieldsFn } from '../../../../app/form/Form';
import { CHECK_YOUR_ANSWERS, GENERIC_ERROR_PAGE } from '../../../urls';
import { handleDocumentUpload } from '../utils';

@autobind
export default class UploadAdditionalDocumentPostController extends PostController<AnyObject> {
  constructor(protected fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const { saveAndContinue, uploadFile } = req.body;
    req.session.errors = [];

    if (uploadFile) {
      return handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS);
    }

    if (saveAndContinue) {
      return this.redirect(req, res, CHECK_YOUR_ANSWERS);
    }

    res.redirect(GENERIC_ERROR_PAGE);
  }
}
