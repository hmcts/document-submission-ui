/* eslint-disable @typescript-eslint/no-unused-vars */
import autobind from 'autobind-decorator';
import config from 'config';
import { Response } from 'express';

import { getNextStepUrl } from '../../steps';
import { CONTACT_DETAILS, SAVE_AND_SIGN_OUT} from '../../steps/urls';
import { Case, CaseWithId } from '../case/case';
import { CITIZEN_CREATE, CITIZEN_SAVE_AND_CLOSE, CITIZEN_SUBMIT, CITIZEN_UPDATE } from '../case/definition';
import { Form, FormFields, FormFieldsFn } from '../form/Form';
import { ValidationError } from '../form/validation';

import { AppRequest } from './AppRequest';

enum noHitToSaveAndContinue {
  CITIZEN_HOME_URL = '/citizen-home',
}

@autobind
export class PostController<T extends AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {}

  /**
   * Parse the form body and decide whether this is a save and sign out, save and continue or session time out
   */
  public async post(req: AppRequest<T>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase, req) : this.fields;
    const form = new Form(fields);

    const { saveAndSignOut, saveBeforeSessionTimeout, _csrf, ...formData } = form.getParsedBody(req.body);

    if (req.body.saveAndSignOut) {
      await this.saveAndSignOut(req, res, formData);
    } else if (req.body.saveBeforeSessionTimeout) {
      await this.saveBeforeSessionTimeout(req, res, formData);
    } else if (req.body.cancel) {
      await this.cancel(req, res);
    } else {
      await this.saveAndContinue(req, res, form, formData);
    }
  }

  private async saveAndSignOut(req: AppRequest<T>, res: Response, formData: Partial<Case>): Promise<void> {
    try {
      await this.save(req, formData, CITIZEN_SAVE_AND_CLOSE);
    } catch {
      // ignore
    }
    res.redirect(SAVE_AND_SIGN_OUT);
  }

  private async saveBeforeSessionTimeout(req: AppRequest<T>, res: Response, formData: Partial<Case>): Promise<void> {
    try {
      await this.save(req, formData, this.getEventName(req));
    } catch {
      // ignore
    }
    res.end();
  }

  private async saveAndContinue(req: AppRequest<T>, res: Response, form: Form, formData: Partial<Case>): Promise<void> {
    Object.assign(req.session.userCase, formData);
    req.session.errors = form.getErrors(formData);

    this.filterErrorsForSaveAsDraft(req);

    if (req.session?.user && req.session.errors.length === 0) {
      if (!(Object.values(noHitToSaveAndContinue) as string[]).includes(req.originalUrl)) {
        const eventName = this.getEventName(req);
        if (eventName === CITIZEN_CREATE) {
          req.session.userCase = await this.createCase(req);
        } else if (eventName === CITIZEN_UPDATE || eventName === CITIZEN_SUBMIT) {
          req.session.userCase = await this.updateCase(req, eventName);
        }
      }
    }

    this.redirect(req, res);
  }
  async createCase(req: AppRequest<T>): Promise<CaseWithId | PromiseLike<CaseWithId>> {
    try {
      console.log('Create Case New');
      req.session.userCase = await req.locals.api.createCaseNew(req);
    } catch (err) {
      req.locals.logger.error('Error saving', err);
      req.session.errors = req.session.errors || [];
      req.session.errors.push({ errorType: 'errorSaving', propertyName: '*' });
    }
    return req.session.userCase;
  }

  private async cancel(req: AppRequest<T>, res: Response): Promise<void> {
    const hmctsHomePage: string = config.get('services.hmctsHomePage.url');
    res.redirect(hmctsHomePage);
  }

  protected filterErrorsForSaveAsDraft(req: AppRequest<T>): void {
    if (req.body.saveAsDraft) {
      // skip empty field errors in case of save as draft
      req.session.errors = req.session.errors!.filter(
        item => item.errorType !== ValidationError.REQUIRED && item.errorType !== ValidationError.NOT_SELECTED // &&
        //item.errorType !== ValidationError.NOT_UPLOADED
      );
    }
  }

  protected async save(req: AppRequest<T>, formData: Partial<Case>, eventName: string): Promise<CaseWithId> {
    try {
      console.log('Update Existing Case');
      req.session.userCase = await req.locals.api.triggerEvent(req.session.userCase.id, formData, eventName);
    } catch (err) {
      req.locals.logger.error('Error saving', err);
      req.session.errors = req.session.errors || [];
      req.session.errors.push({ errorType: 'errorSaving', propertyName: '*' });
    }
    return req.session.userCase;
  }

  protected async updateCase(req: AppRequest<T>, eventName: string): Promise<CaseWithId> {
    try {
      console.log('Update Existing Case');
      req.session.userCase = await req.locals.api.updateCase(req, eventName);
    } catch (err) {
      req.locals.logger.error('Error saving', err);
      req.session.errors = req.session.errors || [];
      req.session.errors.push({ errorType: 'errorSaving', propertyName: '*' });
    }
    return req.session.userCase;
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

  // method to check if there is a returnUrl in session and
  // it is one of the allowed redirects from current page
  public checkReturnUrlAndRedirect(req: AppRequest<T>, res: Response, allowedReturnUrls: string[]): void {
    const returnUrl = req.session.returnUrl;
    if (returnUrl && allowedReturnUrls.includes(returnUrl)) {
      req.session.returnUrl = undefined;
      this.redirect(req, res, returnUrl);
    } else {
      this.redirect(req, res);
    }
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getEventName(req: AppRequest): string {
    let eventName;
    if (req.originalUrl === CONTACT_DETAILS && this.isBlank(req)) {
      console.log('creating new case event');
      eventName = CITIZEN_CREATE;
    } else if (req.originalUrl === CONTACT_DETAILS) {
      eventName = CITIZEN_UPDATE;
    } 
    console.log('event is => ' + eventName);
    return eventName;
  }

  private isBlank(req: AppRequest<Partial<Case>>) {
    console.log('inside isBlank() case id is => ' + req.session.userCase.id);
    if (req.session.userCase.id === null || req.session.userCase.id === undefined || req.session.userCase.id === '') {
      return true;
    }
  }
}

export type AnyObject = Record<string, unknown>;
