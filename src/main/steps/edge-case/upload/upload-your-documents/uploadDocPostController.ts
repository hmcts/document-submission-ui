import autobind from 'autobind-decorator';
import { Response } from 'express';

import { UploadDocumentContext } from '../../../../app/case/definition';
import { AppRequest } from '../../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../../app/controller/PostController';
import { FormFields, FormFieldsFn } from '../../../../app/form/Form';
import { parseUrl } from '../../../../steps/common/url-parser';
import { ADDITIONAL_DOCUMENTS_UPLOAD, GENERIC_ERROR_PAGE, UPLOAD_YOUR_DOCUMENTS } from '../../../urls';
import { handleDocumentUpload } from '../utils';

@autobind
export default class UploadDocumentController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const { saveAndContinue, uploadFile } = req.body;
    req.session.errors = [];

    if (uploadFile) {
      return handleDocumentUpload(req, res, UploadDocumentContext.UPLOAD_YOUR_DOCUMENTS);
    }

    if (saveAndContinue) {
      if (!req.session.userCase?.applicantApplicationFormDocuments?.length) {
        req.session.errors.push({
          errorType: 'continueWithoutUploadError',
          propertyName: 'applicationUpload',
        });

        return this.redirect(req, res, parseUrl(UPLOAD_YOUR_DOCUMENTS).url);
      }

      return this.redirect(req, res, parseUrl(ADDITIONAL_DOCUMENTS_UPLOAD).url);
    }

    res.redirect(GENERIC_ERROR_PAGE);
  }
}
