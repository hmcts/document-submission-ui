import autobind from 'autobind-decorator';
import config from 'config';
import { Response } from 'express';

import { getNextStepUrl } from '../../steps';
import { Case } from '../case/case';
import { Form, FormFields, FormFieldsFn } from '../form/Form';
import { ValidationError } from '../form/validation';

import { AppRequest } from './AppRequest';

@autobind
export class PostController<T extends AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {}

  /**
   * Parse the form body and decide whether this is a save and sign out, save and continue or session time out
   */
  public async post(req: AppRequest<T>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase, req) : this.fields;
    const form = new Form(fields);

    const { _csrf, ...formData } = form.getParsedBody(req.body);

    if (req.body.cancel) {
      await this.cancel(req, res);
    } else {
      await this.saveAndContinue(req, res, form, formData);
    }
  }

  private async saveAndContinue(req: AppRequest<T>, res: Response, form: Form, formData: Partial<Case>): Promise<void> {
    Object.assign(req.session.userCase, formData);
    req.session.errors = form.getErrors(formData);
    this.filterErrorsForSaveAsDraft(req);
    this.redirect(req, res);
  }

  private async cancel(req: AppRequest<T>, res: Response): Promise<void> {
    const hmctsHomePage: string = config.get('services.hmctsHomePage.url');
    res.redirect(hmctsHomePage);
  }

  protected filterErrorsForSaveAsDraft(req: AppRequest<T>): void {
    if (req.body.saveAsDraft) {
      // skip empty field errors in case of save as draft
      req.session.errors = req.session.errors.filter(
        item => item.errorType !== ValidationError.REQUIRED && item.errorType !== ValidationError.NOT_SELECTED // &&
        //item.errorType !== ValidationError.NOT_UPLOADED
      );
    }
  }

  public redirect(req: AppRequest<T>, res: Response, nextUrl?: string): void {
    if (!nextUrl) {
      nextUrl = req.session.errors?.length ? req.url : getNextStepUrl(req, req.session.userCase);
    }

    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(nextUrl!);
    });
  }
}

export type AnyObject = Record<string, unknown>;
