/* eslint-disable @typescript-eslint/no-unused-vars */
import autobind from 'autobind-decorator';
import { Response } from 'express';

import { YesOrNo } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { DATE_OF_BIRTH, FULL_NAME } from '../../urls';

@autobind
export class UserRolePostController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase, req) : this.fields;
    const form = new Form(fields);

    const { saveAndSignOut, saveBeforeSessionTimeout, _csrf, ...formData } = form.getParsedBody(req.body);

    req.session.errors = form.getErrors(formData);

    Object.assign(req.session.userCase, formData);

    if (YesOrNo.YES === req.body.namedApplicant) {
      req.session.userCase.applicantFirstName = req.session.user.givenName;
      req.session.userCase.applicantLastName = req.session.user.familyName;
      req.session.userCase.applicantEmailAddress = req.session.user.email;
      this.redirect(req, res, req.session.errors?.length ? req.url : DATE_OF_BIRTH);
    } else {
      req.session.userCase.applicantFirstName = '';
      req.session.userCase.applicantLastName = '';
      req.session.userCase.applicantEmailAddress = '';

      this.redirect(req, res, req.session.errors?.length ? req.url : FULL_NAME);
    }
  }
}

export default UserRolePostController;
