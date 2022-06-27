import autobind from 'autobind-decorator';
import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { Response } from 'express';
import Negotiator from 'negotiator';

import { LanguageToggle } from '../../modules/i18n';
import { CommonContent, Language, generatePageContent } from '../../steps/common/common.content';
import { FIS_COS_API_BASE_URL } from '../../steps/common/constants/apiConstants';
import * as Urls from '../../steps/urls';
import { ADDITIONAL_DOCUMENTS_UPLOAD, COOKIES, UPLOAD_YOUR_DOCUMENTS } from '../../steps/urls';
import { Case, CaseWithId } from '../case/case';

import { AppRequest } from './AppRequest';
export type PageContent = Record<string, unknown>;
export type TranslationFn = (content: CommonContent) => PageContent;

export type AsyncTranslationFn = any;
@autobind
export class GetController {
  constructor(protected readonly view: string, protected readonly content: TranslationFn) {}

  public async get(req: AppRequest, res: Response): Promise<void> {
    console.log('usercase session --->', req.session.userCase);

    this.CookiePrefrencesChanger(req, res);

    if (res.locals.isError || res.headersSent) {
      // If there's an async error, it will have already rendered an error page upstream,
      // so we don't want to call render again
      return;
    }

    const language = this.getPreferredLanguage(req) as Language;
    const addresses = req.session?.addresses;

    const content = generatePageContent({
      language,
      pageContent: this.content,
      userCase: req.session.userCase,
      userEmail: req.session?.user?.email,
      uploadedDocuments: req.session['caseDocuments'],
      AddDocuments: req.session['AddtionalCaseDocuments'],
      addresses,
    });

    console.log({ cookieMessage: req.session.cookieStorageMessage });
    const sessionErrors = req.session?.errors || [];
    const FileErrors = req.session.fileErrors || [];
    if (req.session?.errors || req.session.fileErrors) {
      req.session.errors = undefined;
      req.session.fileErrors = [];
    }

    this.documentDeleteManager(req, res);
    const RedirectConditions = {
      query: req.query.hasOwnProperty('query'),
      documentId: req.query.hasOwnProperty('docId'),
      documentType: req.query.hasOwnProperty('documentType'),
      cookieAnalytics: req.query.hasOwnProperty('analytics'),
      cookieAPM: req.query.hasOwnProperty('apm'),
    };

    /** Cookies  */
    const cookiesForPrefrences = req.cookies.hasOwnProperty('web-cookie-preferences')
      ? JSON.parse(req.cookies['web-cookie-preferences'])
      : {
          analytics: 'off',
          apm: 'off',
        };

    const checkConditions = Object.values(RedirectConditions).includes(true);
    if (!checkConditions) {
      res.render(this.view, {
        ...content,
        uploadedDocuments: req.session['caseDocuments'],
        addtionalDocuments: req.session['AddtionalCaseDocuments'],
        cookiePrefrences: cookiesForPrefrences,
        sessionErrors,
        FileErrors,
        htmlLang: language,
        isDraft: req.session?.userCase?.state ? req.session.userCase.state === '' : true,
      });
      req.session['cookieStorageMessage'] = false;
    }
  }

  private getPreferredLanguage(req: AppRequest) {
    // User selected language
    const requestedLanguage = req.query['lng'] as string;
    if (LanguageToggle.supportedLanguages.includes(requestedLanguage)) {
      return requestedLanguage;
    }

    // Saved session language
    if (req.session?.lang) {
      return req.session.lang;
    }

    // Browsers default language
    const negotiator = new Negotiator(req);
    return negotiator.language(LanguageToggle.supportedLanguages) || 'en';
  }

  public parseAndSetReturnUrl(req: AppRequest): void {
    if (req.query.returnUrl) {
      if (Object.values(Urls).find(item => item === `${req.query.returnUrl}`)) {
        req.session.returnUrl = `${req.query.returnUrl}`;
      }
    }
  }

  public async save(req: AppRequest, formData: Partial<Case>, eventName: string): Promise<CaseWithId> {
    try {
      return await req.locals.api.triggerEvent(req.session.userCase.id, formData, eventName);
    } catch (err) {
      req.locals.logger.error('Error saving', err);
      req.session.errors = req.session.errors || [];
      req.session.errors.push({ errorType: 'errorSaving', propertyName: '*' });
      return req.session.userCase;
    }
  }

  //eslint-disable-next-line @typescript-eslint/ban-types
  public saveSessionAndRedirect(req: AppRequest, res: Response, callback?: Function): void {
    req.session.save(err => {
      if (err) {
        throw err;
      }
      if (callback) {
        callback();
      } else {
        res.redirect(req.url);
      }
    });
  }

  /**Cookies prefrences saver */

  public CookiePrefrencesChanger = (req: AppRequest, res: Response): void => {
    //?analytics=off&apm=off
    if (req.query.hasOwnProperty('analytics') && req.query.hasOwnProperty('apm')) {
      let cookieExpiryDuration = Number(config.get('cookies.expiryTime'));
      const TimeInADay = 24 * 60 * 60 * 1000;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cookieExpiryDuration = cookieExpiryDuration * TimeInADay; //cookie time in milliseconds
      const CookiePreferences = {
        analytics: '',
        apm: '',
      };
      if (req.query.hasOwnProperty('analytics')) {
        switch (req.query['analytics']) {
          case 'off':
            CookiePreferences['analytics'] = 'off';
            break;

          case 'on':
            CookiePreferences['analytics'] = 'on';
            break;

          default:
            CookiePreferences['analytics'] = 'off';
        }
      }
      if (req.query.hasOwnProperty('apm')) {
        switch (req.query['apm']) {
          case 'off':
            CookiePreferences['apm'] = 'off';
            break;

          case 'on':
            CookiePreferences['apm'] = 'on';
            break;

          default:
            CookiePreferences['apm'] = 'off';
        }
      }
      const CookieValue = JSON.stringify(CookiePreferences);

      res.cookie('web-cookie-preferences', CookieValue, {
        maxAge: cookieExpiryDuration,
        httpOnly: true,
        encode: String,
      });
      req.session['cookieStorageMessage'] = true;
      res.redirect(COOKIES);
    }
  };

  public async documentDeleteManager(req: AppRequest, res: Response): Promise<void> {
    if (
      req.query.hasOwnProperty('query') &&
      req.query.hasOwnProperty('docId') &&
      req.query.hasOwnProperty('documentType')
    ) {
      const checkForDeleteQuery = req.query['query'] === 'delete';
      if (checkForDeleteQuery) {
        const { documentType } = req.query;
        const { docId } = req.query;
        const Headers = {
          Authorization: `Bearer ${req.session.user['accessToken']}`,
        };
        const DOCUMENT_DELETEMANAGER: AxiosInstance = axios.create({
          baseURL: config.get(FIS_COS_API_BASE_URL),
          headers: { ...Headers },
        });
        /** Switching type of documents */
        /*eslint no-case-declarations: "error"*/
        switch (documentType) {
          case 'applicationform': {
            try {
              const baseURL = `/doc/dss-orhestration/${docId}/delete`;
              await DOCUMENT_DELETEMANAGER.delete(baseURL);
              const sessionObjectOfApplicationDocuments = req.session['caseDocuments'].filter(document => {
                const { documentId } = document;
                return documentId !== docId;
              });
              req.session['caseDocuments'] = sessionObjectOfApplicationDocuments;
              this.saveSessionAndRedirect(req, res, () => {
                res.redirect(UPLOAD_YOUR_DOCUMENTS);
              });
            } catch (error) {
              console.log(error);
            }

            break;
          }

          case 'additional': {
            try {
              const baseURL = `/doc/dss-orhestration/${docId}/delete`;
              await DOCUMENT_DELETEMANAGER.delete(baseURL);
              const sessionObjectOfAdditionalDocuments = req.session['AddtionalCaseDocuments'].filter(document => {
                const { documentId } = document;
                return documentId !== docId;
              });
              req.session['AddtionalCaseDocuments'] = sessionObjectOfAdditionalDocuments;
              this.saveSessionAndRedirect(req, res, () => {
                res.redirect(ADDITIONAL_DOCUMENTS_UPLOAD);
              });
            } catch (error) {
              console.log(error);
            }

            break;
          }
        }
      }
    }
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getEventName(req: AppRequest): string {
    return '';
  }
}
