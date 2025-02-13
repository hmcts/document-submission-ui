import autobind from 'autobind-decorator';
import config from 'config';
import { Response } from 'express';
import Negotiator from 'negotiator';

import { LanguageToggle } from '../../modules/i18n';
import { CommonContent, Language, generatePageContent } from '../../steps/common/common.content';
import { TOGGLE_SWITCH } from '../../steps/common/constants/commonConstants';
import * as Urls from '../../steps/urls';
import { COOKIES } from '../../steps/urls';

import { AppRequest } from './AppRequest';
export type PageContent = Record<string, unknown>;
export type TranslationFn = (content: CommonContent) => PageContent;

@autobind
export class GetController {
  constructor(protected readonly view: string, protected readonly content: TranslationFn) {}

  public async get(req: AppRequest, res: Response): Promise<void> {
    this.CookiePrefrencesChanger(req, res);

    if (res.locals.isError || res.headersSent) {
      // If there's an async error, it will have already rendered an error page upstream,
      // so we don't want to call render again
      return;
    }

    const language = this.getPreferredLanguage(req) as Language;
    const addresses = req.session?.addresses;

    const sessionErrors = req.session?.errors || [];

    /**
     *
     *                      This util allows to delete document
     *                      the params it uses is @req and @res
     *                      This is uses generatePageContent Instance of the this GetController class
     *                      All page contents save for generating page data
     *                      the page content loads up all Page data
     *      ************************************ ************************************
     *      ************************************  ************************************
     *
     */
    const content = generatePageContent({
      language,
      pageContent: this.content,
      userCase: req.session.userCase,
      userEmail: req.session?.user?.email,
      uploadedDocuments: req.session.userCase.applicantApplicationFormDocuments,
      addDocuments: req.session.userCase.applicantAdditionalDocuments,
      addresses,
      additionalData: {
        req,
        user: {
          fullname: `${req.session.user?.givenName} ${req.session.user?.familyName}`,
        },
      },
    });

    if (req.session?.errors) {
      req.session.errors = [];
    }

    const RedirectConditions = {
      /*************************************** query @query  ***************************/
      query: req.query.hasOwnProperty('query'),
      /*************************************** query @documentId  ***************************/
      documentId: req.query.hasOwnProperty('docId'),
      /*************************************** query @documentType  ***************************/
      documentType: req.query.hasOwnProperty('documentType'),
      /*************************************** query @analytics for monitoring and performance ***************************/
      cookieAnalytics: req.query.hasOwnProperty('analytics'),
      /*************************************** query  @apm for monitoring and performance  ***************************/
      cookieAPM: req.query.hasOwnProperty('apm'),
    };

    /**
     *
     *                      This util allows to delete document
     *                      the params it uses is @ds-web-cookie-preferences
     *                      This is used to check for current cookiesPreferences
     *      ************************************ ************************************
     *      ************************************  ************************************
     *
     */
    const cookiesForPrefrences = req.cookies.hasOwnProperty('ds-web-cookie-preferences')
      ? JSON.parse(req.cookies['ds-web-cookie-preferences'])
      : {
          analytics: 'off',
          apm: 'off',
        };

    /**
     *
     *                      This util allows to delete document
     *                      the params it uses is @ds-web-cookie-preferences
     *                      This is used to check for current cookiesPreferences
     *      ************************************ ************************************
     *      ************************************  ************************************
     *
     */
    let pageRenderableContents = {
      ...content,
      uploadedDocuments: req.session.userCase.applicantApplicationFormDocuments,
      addtionalDocuments: req.session.userCase.applicantAdditionalDocuments,
      cookiePrefrences: cookiesForPrefrences,
      sessionErrors,
      paymentError: req.session.paymentError,
      cookieMessage: false,
      htmlLang: language,
    };

    req.session.paymentError = { hasError: false, errorContext: null };

    /**
     *
     *                      This util allows saved cookies to have redirect after successfully saving
     *                      the params it uses is @ds-web-cookie-preferences
     *                      This is used to check for current cookiesPreferences
     *      ************************************ ************************************
     *      ************************************  ************************************
     *
     */
    const cookieWithSaveQuery = COOKIES + '?togglesaveCookie=true';
    const checkforCookieUrlAndQuery = req.url === cookieWithSaveQuery;
    if (checkforCookieUrlAndQuery) {
      pageRenderableContents = { ...pageRenderableContents, cookieMessage: true };
    }

    const checkConditions = Object.values(RedirectConditions).includes(true);
    if (!checkConditions) {
      res.render(this.view, pageRenderableContents);
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
    return negotiator.language(LanguageToggle.supportedLanguages) ?? 'en';
  }

  public parseAndSetReturnUrl(req: AppRequest): void {
    if (req.query.returnUrl) {
      if (Object.values(Urls).find(item => item === `${req.query.returnUrl}`)) {
        req.session.returnUrl = `${req.query.returnUrl}`;
      }
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
          case TOGGLE_SWITCH.OFF:
            CookiePreferences['analytics'] = TOGGLE_SWITCH.OFF;
            break;

          case TOGGLE_SWITCH.ON:
            CookiePreferences['analytics'] = TOGGLE_SWITCH.ON;
            break;

          default:
            CookiePreferences['analytics'] = TOGGLE_SWITCH.OFF;
        }
      }
      if (req.query.hasOwnProperty('apm')) {
        switch (req.query['apm']) {
          case TOGGLE_SWITCH.OFF:
            CookiePreferences['apm'] = TOGGLE_SWITCH.OFF;
            break;

          case TOGGLE_SWITCH.ON:
            CookiePreferences['apm'] = TOGGLE_SWITCH.ON;
            break;

          default:
            CookiePreferences['apm'] = TOGGLE_SWITCH.OFF;
        }
      }
      const cookieValue = JSON.stringify(CookiePreferences);

      res.cookie('ds-web-cookie-preferences', cookieValue, {
        maxAge: cookieExpiryDuration,
        httpOnly: false,
        encode: String,
      });
      const RedirectURL = COOKIES + '?togglesaveCookie=true';
      res.redirect(RedirectURL);
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getEventName(req: AppRequest): string {
    return '';
  }
}
