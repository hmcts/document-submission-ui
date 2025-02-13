/* eslint-disable @typescript-eslint/no-unused-vars */
import autobind from 'autobind-decorator';
import { Response } from 'express';

import { CaseWithId } from '../../../app/case/case';
import { CASE_EVENT } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { GENERIC_ERROR_PAGE } from '../../../steps/urls';

@autobind
export default class ContactDetailsPostController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase, req) : this.fields;
    const form = new Form(fields);

    const { saveAndContinue, _csrf, ...formData } = form.getParsedBody(req.body);

    if (saveAndContinue) {
      Object.assign(req.session.userCase, {
        applicantHomeNumber: formData.applicantHomeNumber,
        applicantPhoneNumber: formData.applicantPhoneNumber,
      });
      req.session.errors = form.getErrors(formData);

      if (req.session.errors.length) {
        return super.redirect(req, res);
      }

      try {
        if (!req.session?.userCase?.id) {
          Object.assign(req.session.userCase, await req.locals.api.createCase(req.session.userCase));
          req.session.userCase = (await req.locals.api.updateCase(
            req.session.userCase,
            CASE_EVENT.UPDATE_CASE
          )) as CaseWithId;
        }
      } catch (err) {
        req.session.errors.push({ errorType: 'errorSaving', propertyName: '*' });
      } finally {
        super.redirect(req, res);
      }
      return;
    }

    return res.redirect(GENERIC_ERROR_PAGE);
  }
}
