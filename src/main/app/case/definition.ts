import { State } from './CaseApi';

export interface Address {
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
  PostTown: string;
  County: string;
  PostCode: string;
  Country: string;
}

export enum ContactPreference {
  ACCOUNT_OWNER = 'ACCOUNT_OWNER',
  NAMED_PERSON = 'NAMED_PERSON',
}

export enum UserRole {
  SELF = 'self',
  FOR_SOMEONE = 'forSomeone',
  COURT_STAFF = 'forCourtStaff',
}
export type AddressUK = Address;

export interface CaseLink {
  CaseReference: string;
}

export interface Document {
  document_url: string;
  document_filename: string;
  document_binary_url: string;
}

export interface DocumentUploadResponse {
  status: string;
  document: DocumentResponse;
}

export type DocumentResponse = {
  document_url: string;
  document_binary_url: string;
  document_filename: string;
  document_hash: string;
  document_creation_date: string;
};

export interface DocumentReference {
  id: string;
  value: {
    document_url: string;
    document_filename: string;
    document_binary_url: string;
  };
}

export interface DynamicList {
  value: DynamicListElement;
  list_items: DynamicListElement[];
  valueLabel: string;
  valueCode: string;
}

export interface DynamicListElement {
  code: string;
  label: string;
}

export interface Fee {
  FeeAmount: string;
  FeeCode: string;
  FeeDescription: string;
  FeeVersion: string;
}

export interface ListValue<T> {
  id: string;
  value: T;
}

export interface OrderSummary {
  PaymentReference?: string;
  Fees: ListValue<Fee>[];
  PaymentTotal: string;
}

export interface CaseNote {
  author: string;
  date: string;
  note: string;
}

export interface Applicant {
  id: string;
  value: PartyDetails;
}
export interface Application {
  applicantStatementOfTruth: YesOrNo;
}

export const enum ContactDetails {
  EMAIL = 'email',
  PHONE = 'phone',
}

export interface CaseData {
  id: string;
  state: State;
  createdDate: string;
  lastModifiedDate: string;
  applicantCaseName: string;
  applicants: Applicant[];
  applicantsFL401: PartyDetails;
  edgeCaseTypeOfApplication: TYPE_OF_APPLICATION;
  caseTypeOfApplication: CASE_TYPE_OF_APPLICATION;
  caseCreatedBy: string;
  dssUploadedDocuments: DocumentReference[];
  dssUploadedAdditionalDocuments: DocumentReference[];
  dssCaseData: string;
}
export interface PartyDetails {
  email: string;
  gender: string;
  address: Address;
  dxNumber: string;
  landline: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  otherGender: string;
  phoneNumber: string;
  placeOfBirth: string;
  previousName: string;
  sendSignUpLink: string;
  solicitorEmail: string;
  isAddressUnknown: string;
  isDateOfBirthKnown: string;
  solicitorReference: string;
  solicitorTelephone: string;
  isPlaceOfBirthKnown: string;
  isDateOfBirthUnknown: string;
  isAddressConfidential: string;
  isCurrentAddressKnown: string;
  relationshipToChildren: string;
  representativeLastName: string;
  representativeFirstName: string;
  canYouProvidePhoneNumber: string;
  canYouProvideEmailAddress: string;
  isAtAddressLessThan5Years: string;
  isPhoneNumberConfidential: string;
  isEmailAddressConfidential: string;
  respondentLivedWithApplicant: string;
  doTheyHaveLegalRepresentation: string;
  addressLivedLessThan5YearsDetails: string;
  otherPersonRelationshipToChildren: string[];
  isAtAddressLessThan5YearsWithDontKnow: string;
  response: Response;
  user: User;
  contactPreferences?: ContactPreference | null;
  isRemoveLegalRepresentativeRequested?: YesOrNo;
  partyId: string;
  liveInRefuge: YesOrNo;
  refugeConfidentialityC8Form?: Document | null;
}

export interface User {
  email: string;
  idamId: string;
  solicitorRepresented?: string;
  pcqId?: string;
}

export interface StatusHistoriesItem {
  date_updated: string;
  date_created: string;
  external_status: string;
  status: string;
  error_code: string;
  error_message: string;
}

export interface CourtListOptions {
  epimms_id: string;
  site_name: string;
  court_name: string;
}

export const enum FieldType {
  Unspecified = 'Unspecified',
  Email = 'Email',
  PhoneUK = 'PhoneUK',
  Date = 'Date',
  Document = 'Document',
  Schedule = 'Schedule',
  TextArea = 'TextArea',
  FixedList = 'FixedList',
  FixedRadioList = 'FixedRadioList',
  YesOrNo = 'YesOrNo',
  Address = 'Address',
  CaseLink = 'CaseLink',
  OrderSummary = 'OrderSummary',
  MultiSelectList = 'MultiSelectList',
  Collection = 'Collection',
  Label = 'Label',
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export const enum YesNoNotsure {
  YES = 'Yes',
  NO = 'No',
  NOT_SURE = 'NotSure',
}

export const enum SectionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export const enum LanguagePreference {
  ENGLISH = 'ENGLISH',
  WELSH = 'WELSH',
}

export const enum EmailAddress {
  EMAIL_ADDRESS = 'em',
}

export const enum HttpStatus {
  CONTINUE = 'CONTINUE',
  SWITCHING_PROTOCOLS = 'SWITCHING_PROTOCOLS',
  PROCESSING = 'PROCESSING',
  CHECKPOINT = 'CHECKPOINT',
  OK = 'OK',
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  NON_AUTHORITATIVE_INFORMATION = 'NON_AUTHORITATIVE_INFORMATION',
  NO_CONTENT = 'NO_CONTENT',
  RESET_CONTENT = 'RESET_CONTENT',
  PARTIAL_CONTENT = 'PARTIAL_CONTENT',
  MULTI_STATUS = 'MULTI_STATUS',
  ALREADY_REPORTED = 'ALREADY_REPORTED',
  IM_USED = 'IM_USED',
  MULTIPLE_CHOICES = 'MULTIPLE_CHOICES',
  MOVED_PERMANENTLY = 'MOVED_PERMANENTLY',
  FOUND = 'FOUND',
  /**
   * @deprecated
   */
  MOVED_TEMPORARILY = 'MOVED_TEMPORARILY',
  SEE_OTHER = 'SEE_OTHER',
  NOT_MODIFIED = 'NOT_MODIFIED',
  /**
   * @deprecated
   */
  USE_PROXY = 'USE_PROXY',
  TEMPORARY_REDIRECT = 'TEMPORARY_REDIRECT',
  PERMANENT_REDIRECT = 'PERMANENT_REDIRECT',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  NOT_ACCEPTABLE = 'NOT_ACCEPTABLE',
  PROXY_AUTHENTICATION_REQUIRED = 'PROXY_AUTHENTICATION_REQUIRED',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  CONFLICT = 'CONFLICT',
  GONE = 'GONE',
  LENGTH_REQUIRED = 'LENGTH_REQUIRED',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  /**
   * @deprecated
   */
  REQUEST_ENTITY_TOO_LARGE = 'REQUEST_ENTITY_TOO_LARGE',
  URI_TOO_LONG = 'URI_TOO_LONG',
  /**
   * @deprecated
   */
  REQUEST_URI_TOO_LONG = 'REQUEST_URI_TOO_LONG',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
  REQUESTED_RANGE_NOT_SATISFIABLE = 'REQUESTED_RANGE_NOT_SATISFIABLE',
  EXPECTATION_FAILED = 'EXPECTATION_FAILED',
  I_AM_A_TEAPOT = 'I_AM_A_TEAPOT',
  /**
   * @deprecated
   */
  INSUFFICIENT_SPACE_ON_RESOURCE = 'INSUFFICIENT_SPACE_ON_RESOURCE',
  /**
   * @deprecated
   */
  METHOD_FAILURE = 'METHOD_FAILURE',
  /**
   * @deprecated
   */
  DESTINATION_LOCKED = 'DESTINATION_LOCKED',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  LOCKED = 'LOCKED',
  FAILED_DEPENDENCY = 'FAILED_DEPENDENCY',
  TOO_EARLY = 'TOO_EARLY',
  UPGRADE_REQUIRED = 'UPGRADE_REQUIRED',
  PRECONDITION_REQUIRED = 'PRECONDITION_REQUIRED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  REQUEST_HEADER_FIELDS_TOO_LARGE = 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  UNAVAILABLE_FOR_LEGAL_REASONS = 'UNAVAILABLE_FOR_LEGAL_REASONS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  HTTP_VERSION_NOT_SUPPORTED = 'HTTP_VERSION_NOT_SUPPORTED',
  VARIANT_ALSO_NEGOTIATES = 'VARIANT_ALSO_NEGOTIATES',
  INSUFFICIENT_STORAGE = 'INSUFFICIENT_STORAGE',
  LOOP_DETECTED = 'LOOP_DETECTED',
  BANDWIDTH_LIMIT_EXCEEDED = 'BANDWIDTH_LIMIT_EXCEEDED',
  NOT_EXTENDED = 'NOT_EXTENDED',
  NETWORK_AUTHENTICATION_REQUIRED = 'NETWORK_AUTHENTICATION_REQUIRED',
}

export const enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export const CITIZEN_SAVE_AND_CLOSE = 'citizen-save-and-close';
export const CITIZEN_UPDATE = 'UPDATE';
export const CITIZEN_CREATE = 'CREATE';
export const CITIZEN_SUBMIT = 'SUBMIT';
export const enum CASE_EVENT {
  UPDATE_CASE = 'updateDssEdgeCase',
  SUBMIT_CA_CASE = 'submitDssCaEdgeCase',
  SUBMIT_CA_CASE_WITH_HWF = 'submitDssCaEdgeCaseWithHwf',
  SUBMIT_DA_CASE = 'submitDssDaEdgeCase',
}

export const enum CASE_TYPE_OF_APPLICATION {
  C100 = 'C100',
  FL401 = 'FL401',
}

export enum TYPE_OF_APPLICATION {
  FGM = 'FGM',
  FMPO = 'FMPO',
  SPECIAL_GUARDIANSHIP_ORDER = 'SG',
  DECLARATION_OF_PARENTAGE = 'DOP',
  PARENTAL_ORDER = 'PO',
}

export interface PaymentError {
  hasError: boolean;
  errorContext: PaymentErrorContext | null;
}

export enum PaymentErrorContext {
  DEFAULT_PAYMENT_ERROR = 'defaultPaymentError',
  PAYMENT_UNSUCCESSFUL = 'paymentUnsuccessful',
  APPLICATION_NOT_SUBMITTED = 'applicationNotSubmitted',
}

export type UploadDocument = {
  id: string;
  value: {
    documentLink: Document;
  };
};

export enum UploadDocumentContext {
  UPLOAD_YOUR_DOCUMENTS = 'upload-your-documents',
  UPLOAD_ADDITIONAL_DOCUMENTS = 'upload-additional-documents',
}
