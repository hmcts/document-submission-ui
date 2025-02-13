import config from 'config';
import { Request, Response } from 'express';

import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { SIGN_IN_URL, TYPE_OF_APPLICATION_URL } from '../../../steps/urls';

/*** query params for @edgeCaseType */
const edgeCaseTypeQueryValidations = (req: Request, res: Response, loginURL, SystemContent, ToggleLanguage) => {
  if (req.query.hasOwnProperty('edgecaseType')) {
    /** validation need to be done */
    const ValidqueryParams: [] = config.get('queryParamsforApp.query');
    const ValidQueryinConfig = Object.keys(ValidqueryParams).some(item => req.query['edgecaseType'] === item);
    if (ValidQueryinConfig) {
      const queryElement: any = req.query['edgecaseType'];
      const findRespectiveValueToQuery =
        Object.values(ValidqueryParams)[Object.keys(ValidqueryParams).indexOf(queryElement)];
      req.session['edgecaseType'] = findRespectiveValueToQuery;
      res.render('landing.njk', { loginURL, content: SystemContent, ToggleLanguage });
    } else {
      res.render('error.njk');
    }
  } else {
    res.render('landing.njk', { loginURL, content: SystemContent, ToggleLanguage });
  }
};

export const LandingController = (req: Request, res: Response): void => {
  const loginURL = SIGN_IN_URL;
  if (req?.session?.hasOwnProperty('user')) {
    res.redirect(TYPE_OF_APPLICATION_URL);
  } else {
    try {
      const resourceLoader = new ResourceReader();
      resourceLoader.Loader('landing');
      const Translations = resourceLoader.getFileContents().translations;

      /**
       * @SystemLanguage
       */
      const en = Translations.en;
      const cy = Translations.cy;

      let SystemContent = en;
      let ToggleLanguage = 'cy';

      if (req.query.hasOwnProperty('lang')) {
        if (req.query['lang'] === 'en') {
          SystemContent = en;
          ToggleLanguage = 'cy';
        } else if (req.query['lang'] === 'cy') {
          SystemContent = cy;
          ToggleLanguage = 'en';
        } else {
          SystemContent = en;
          ToggleLanguage = 'cy';
        }
      }

      edgeCaseTypeQueryValidations(req, res, loginURL, SystemContent, ToggleLanguage);
    } catch (exception) {
      res.render('error');
    }
  }
};
