import { TYPE_OF_APPLICATION } from '../../app/case/definition';
import { parseUrl } from '../../steps/common/url-parser';
import { Sections, Step } from '../constants';
import {
  ADDITIONAL_DOCUMENTS_UPLOAD,
  APPLICATION_SUBMITTED,
  CHECK_YOUR_ANSWERS,
  CONTACT_DETAILS,
  CONTACT_PREFERENCES,
  COOKIES,
  DATE_OF_BIRTH,
  EMAIL_ADDRESS,
  FIND_ADDRESS,
  FULL_NAME,
  HELP_WITH_FEE,
  MANUAL_ADDRESS,
  PAY_YOUR_FEE,
  PageLink,
  SELECT_ADDRESS,
  SELECT_COURT,
  SIGN_OUT_URL,
  STATEMENT_OF_TRUTH,
  TYPE_OF_APPLICATION_URL,
  UPLOAD_YOUR_DOCUMENTS,
  USER_ROLE,
} from '../urls';
export const edgecaseSequence: Step[] = [
  {
    url: TYPE_OF_APPLICATION_URL,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => USER_ROLE,
  },
  {
    url: USER_ROLE,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => FULL_NAME,
  },
  {
    url: FULL_NAME,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => DATE_OF_BIRTH,
  },

  {
    url: DATE_OF_BIRTH,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => FIND_ADDRESS,
  },
  {
    url: FIND_ADDRESS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => SELECT_ADDRESS,
  },
  {
    url: SELECT_ADDRESS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => CONTACT_PREFERENCES,
  },
  {
    url: MANUAL_ADDRESS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => CONTACT_PREFERENCES,
  },
  {
    url: CONTACT_PREFERENCES,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => EMAIL_ADDRESS,
  },
  {
    url: EMAIL_ADDRESS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => CONTACT_DETAILS,
  },
  {
    url: CONTACT_DETAILS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: data =>
      [TYPE_OF_APPLICATION.FGM, TYPE_OF_APPLICATION.FMPO].includes(data.edgeCaseTypeOfApplication!)
        ? SELECT_COURT
        : (parseUrl(UPLOAD_YOUR_DOCUMENTS).url as PageLink),
  },
  {
    url: SELECT_COURT,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => parseUrl(UPLOAD_YOUR_DOCUMENTS).url as PageLink,
  },
  {
    url: UPLOAD_YOUR_DOCUMENTS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => parseUrl(ADDITIONAL_DOCUMENTS_UPLOAD).url as PageLink,
  },
  {
    url: ADDITIONAL_DOCUMENTS_UPLOAD,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => CHECK_YOUR_ANSWERS,
  },
  {
    url: CHECK_YOUR_ANSWERS,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => STATEMENT_OF_TRUTH,
  },
  {
    url: STATEMENT_OF_TRUTH,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: data =>
      [TYPE_OF_APPLICATION.FGM, TYPE_OF_APPLICATION.FMPO].includes(data.edgeCaseTypeOfApplication!)
        ? APPLICATION_SUBMITTED
        : PAY_YOUR_FEE,
  },
  {
    url: PAY_YOUR_FEE,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => HELP_WITH_FEE,
  },
  {
    url: HELP_WITH_FEE,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => SIGN_OUT_URL,
  },
  {
    url: APPLICATION_SUBMITTED,
    showInSection: Sections.AboutEdgeCase,
    getNextStep: () => TYPE_OF_APPLICATION_URL,
  },
  {
    url: USER_ROLE,
    getNextStep: () => FULL_NAME,
  },
  {
    url: COOKIES,
    getNextStep: () => USER_ROLE,
  },
];
