import { AnyObject } from '../controller/PostController';

import { State } from './CaseApi';
import {
  CASE_TYPE_OF_APPLICATION,
  CaseData,
  ContactPreference,
  Document,
  TYPE_OF_APPLICATION,
  UserRole,
  YesOrNo,
} from './definition';

export const formFieldsToCaseMapping: Partial<Record<keyof Case, keyof CaseData>> = {};

export function formatCase<InputFormat, OutputFormat>(fields: FieldFormats, data: InputFormat): OutputFormat {
  const result = {};
  for (const field of Object.keys(data as Record<string, any>)) {
    const value = fields[field];

    if (typeof value === 'function') {
      Object.assign(result, value(data));
    } else if (typeof fields[field] === 'string') {
      result[value] = data[field];
    }
  }
  return result as OutputFormat;
}

export type FieldFormats = Record<string, string | ((AnyObject) => AnyObject)>;

export interface CaseWithId extends Case {
  id: string;
  state: State;
  paymentDetails?: {
    payment_reference: string;
    date_created: string;
    external_reference: string;
    next_url: string;
    status: string;
    serviceRequestReference: string;
  };
  paymentSuccessDetails?: {
    amount: string;
    reference: string;
    ccd_case_number: string;
    case_reference: string;
    channel: string;
    method: string;
    status: string;
    external_reference: string;
    payment_group_reference: string;
  };
}

export interface CaseWithDocuments {
  addtionalDocuments: any;
  uploadedDocuments: any;
}

export enum Checkbox {
  Checked = 'checked',
  Unchecked = '',
}

export interface CaseDate {
  year: string;
  month: string;
  day: string;
}

export type Date = string;

export enum LanguagePreference {
  English = 'english',
  Welsh = 'welsh',
}

export interface UploadedFile {
  id: string;
  name: string;
}

export enum FieldPrefix {
  APPLICANT1 = 'applicant1',
  APPLICANT = 'applicant',
  APPLICANT2 = 'applicant2',
  CHILDREN = 'children',
  BIRTH_FATHER = 'birthFather',
  BIRTH_MOTHER = 'birthMother',
  OTHER_PARENT = 'otherParent',
}

export interface Case {
  edgeCaseTypeOfApplication: TYPE_OF_APPLICATION;
  caseTypeOfApplication: CASE_TYPE_OF_APPLICATION;
  whomYouAreApplying: UserRole;
  namedApplicant: YesOrNo;
  contactPreferenceType: ContactPreference;
  applicantFirstName: string;
  applicantLastName: string;
  applicantDateOfBirth: CaseDate;
  applicantEmailAddress: string;
  applicantPhoneNumber: string;
  applicantHomeNumber: string;
  applicantAddress1: string;
  applicantAddress2: string;
  applicantAddressTown: string;
  applicantAddressCountry: string;
  applicantAddressPostcode: string;
  selectedCourtId?: string;
  applicantApplicationFormDocuments: Document[] | [];
  applicantAdditionalDocuments: Document[] | [];
  paymentServiceRequestReferenceNumber?: string;
  paymentReferenceNumber?: string;
  helpWithFeesReferenceNumber?: string;
  hwfPaymentSelection?: YesOrNo;
  applicantStatementOfTruth: YesOrNo;
  applicantCaseName: string;
  lastModifiedDate: string;
  caseCreatedBy: string;
  applicationFee?: string;
}
