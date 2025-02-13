export type PageLink = `/${string}`;

export const HOME_URL: PageLink = '/';
export const CALLBACK_URL: PageLink = '/receiver';
export const SIGN_IN_URL: PageLink = '/login';
export const SIGN_OUT_URL: PageLink = '/logout';
export const SAVE_AND_SIGN_OUT: PageLink = '/save-and-sign-out';
export const TIMED_OUT_URL: PageLink = '/timed-out';
export const KEEP_ALIVE_URL: PageLink = '/keep-alive';
export const CSRF_TOKEN_ERROR_URL: PageLink = '/csrf-token-error';
export const GENERIC_ERROR_PAGE: PageLink = '/error';
export const SESSION: PageLink = '/api/session';

export const DOCUMENT_UPLOAD_URL: PageLink = '/document-manager';

export const ADDITIONAL_DOCUMENTS_UPLOAD: PageLink = '/upload/upload-additional-documents/:removeFileId?';
export const TASK_LIST_URL: PageLink = '/task-list';

export const APPLYING_WITH_URL: PageLink = '/applying-with';
export const EDGE_CASE_URL: PageLink = '/edge-case';
export const FULL_NAME: PageLink = '/full-name';
export const USER_ROLE: PageLink = '/user-role';
export const DATE_OF_BIRTH: PageLink = '/date-of-birth';
export const FIND_ADDRESS: PageLink = '/address/lookup';
export const SELECT_ADDRESS: PageLink = '/address/select';
export const EMAIL_ADDRESS: PageLink = '/email-address';
export const MANUAL_ADDRESS: PageLink = '/address/manual';
export const CONTACT_DETAILS: PageLink = '/contact-details';
export const PAY_YOUR_FEE: PageLink = '/pay-your-fee';
export const HELP_WITH_FEE: PageLink = '/help-with-fee';
export const UPLOAD_YOUR_DOCUMENTS: PageLink = '/upload/upload-your-documents/:removeFileId?';
export const CONTACT_PREFERENCES: PageLink = '/contact-preferences';
export const CHECK_YOUR_ANSWERS: PageLink = '/check-your-answers';
export const STATEMENT_OF_TRUTH: PageLink = '/statement-of-truth';
export const APPLICATION_SUBMITTED: PageLink = '/application-submitted';
export const COOKIES: PageLink = '/cookies';
export const PRIVACY_POLICY: PageLink = '/privacy-policy';
export const ACCESSIBILITY_STATEMENT: PageLink = '/accessibility-statement';
export const TERMS_AND_CONDITIONS: PageLink = '/terms-and-conditions';
export const CONTACT_US: PageLink = '/contact-us';

export const CHECK_JURISDICTION: PageLink = '/check-jurisdiction';
export const WHERE_YOUR_LIVES_ARE_BASED_URL: PageLink = '/where-your-lives-are-based';
export const JURISDICTION_INTERSTITIAL_URL: PageLink = '/you-can-use-english-welsh-courts';
export const RESIDUAL_JURISDICTION: PageLink = '/are-you-eligible-for-residual-jurisdiction';
export const JURISDICTION_MAY_NOT_BE_ABLE_TO: PageLink = '/you-may-not-be-able-to-england-and-wales';
export const JURISDICTION_CONNECTION_SUMMARY: PageLink = '/connection-summary';
export const PAY_AND_SUBMIT: PageLink = '/pay-and-submit';
export const ELIGIBILITY_URL: PageLink = '/eligibility';
export const TYPE_OF_APPLICATION_URL: PageLink = '/type-of-application';
export const SELECT_COURT: PageLink = '/select-court';

/** @Edge case  Payment Handler*/
export const PAYMENT_BASE_URL: PageLink = '/fees-and-payment-apis';
export const PAYMENT_GATEWAY_ENTRY_URL: PageLink = '/payments/gateway';
export const PAYMENT_RETURN_URL: PageLink = '/payment/reciever/callback';
export const PAYMENT_RETURN_URL_CALLBACK: PageLink = `${PAYMENT_RETURN_URL}/:paymentId/:status`;
export const CREATE_PAYMENT: PageLink = `${PAYMENT_BASE_URL}/create-payment`;
export const GET_PAYMENT_STATUS = `${PAYMENT_BASE_URL}/retrievePaymentStatus/:paymentReference/:caseId`;
