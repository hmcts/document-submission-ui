import config from 'config';
import { Application, NextFunction, Response } from 'express';
import _ from 'lodash';

import { getRedirectUrl, getUserDetails } from '../../app/auth/user/oidc';
import { getCaseApi } from '../../app/case/CaseApi';
import { CaseWithId } from '../../app/case/case';
import { AppRequest } from '../../app/controller/AppRequest';
import { CALLBACK_URL, SIGN_IN_URL, SIGN_OUT_URL, TYPE_OF_APPLICATION_URL } from '../../steps/urls';

//TODO remove applicant2 related stuff
/**
 * Adds the oidc middleware to add oauth authentication
 */
export class OidcMiddleware {
  public enableFor(app: Application): void {
    const protocol = app.locals.developmentMode ? 'http://' : 'https://';
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const { errorHandler } = app.locals;

    app.get(SIGN_IN_URL, (req, res) =>
      req.session.destroy(() => res.redirect(getRedirectUrl(`${protocol}${res.locals.host}${port}`, CALLBACK_URL)))
    );

    app.get(SIGN_OUT_URL, (req, res) => req.session.destroy(() => res.redirect('/')));

    app.get(
      CALLBACK_URL,
      errorHandler(async (req: AppRequest, res: Response) => {
        if (_.isString(req.query?.code)) {
          try {
            req.session.user = await getUserDetails(
              `${protocol}${res.locals.host}${port}`,
              req.query.code,
              CALLBACK_URL
            );
            this.setupApplicationSettings(req, res, () => res.redirect(TYPE_OF_APPLICATION_URL));
          } catch (error) {
            res.redirect(SIGN_IN_URL);
          }
        } else {
          res.redirect(SIGN_IN_URL);
        }
      })
    );

    app.use(
      errorHandler(async (req: AppRequest, res: Response, next: NextFunction) => {
        if (req.session?.user) {
          return this.setupApplicationSettings(req, res, next);
        }
        res.redirect(SIGN_IN_URL);
      })
    );
  }

  private setupApplicationSettings(req: AppRequest, res: Response, next: (err: any) => void): void {
    res.locals.isLoggedIn = true;
    if (!req.locals?.api) {
      req.locals.api = getCaseApi(req.session.user, req.locals.logger);
    }
    if (!req.session?.userCase) {
      req.session.userCase = {} as CaseWithId;
    }
    if (!req.session?.applicationSettings) {
      req.session.applicationSettings = {};
    }
    if (!req.session?.errors) {
      req.session.errors = [];
    }
    req.session.save(next);
  }
}
