import { State } from './CaseApi';
import { Case, CaseDate, CaseWithId } from './case';
import {
  CASE_TYPE_OF_APPLICATION,
  CaseData,
  ContactPreference,
  Document,
  TYPE_OF_APPLICATION,
  UserRole,
  YesOrNo,
} from './definition';

export const prepareCaseRequestData = (userCase: CaseWithId): CreateCaseRequest => {
  return {
    edgeCaseTypeOfApplication: userCase.edgeCaseTypeOfApplication,
    applicantCaseName: `${userCase.applicantFirstName} ${userCase.applicantLastName}`,
    caseTypeOfApplication: getCaseType(userCase?.edgeCaseTypeOfApplication),
  };
};

export const mapCreateCaseResponseData = (response: CaseData): CreateCaseResponse => {
  return {
    id: response.id,
    state: response.state,
    caseTypeOfApplication: response.caseTypeOfApplication,
    edgeCaseTypeOfApplication: response.edgeCaseTypeOfApplication,
    applicantCaseName: response.applicantCaseName,
    lastModifiedDate: response.lastModifiedDate,
    caseCreatedBy: response.caseCreatedBy,
  };
};

export const prepareUpdateCaseRequestData = (userCase: CaseWithId): UpdateCaseRequest => {
  return {
    dssCaseData: JSON.stringify({
      edgeCaseTypeOfApplication: userCase?.edgeCaseTypeOfApplication,
      whomYouAreApplying: userCase?.whomYouAreApplying,
      namedApplicant: userCase?.whomYouAreApplying === UserRole.SELF ? YesOrNo.YES : YesOrNo.NO,
      caseTypeOfApplication: getCaseType(userCase?.edgeCaseTypeOfApplication),
      applicantFirstName: userCase?.applicantFirstName,
      applicantLastName: userCase?.applicantLastName,
      applicantDateOfBirth: userCase?.applicantDateOfBirth,
      contactPreference: userCase?.contactPreferenceType,
      applicantEmailAddress: userCase?.applicantEmailAddress,
      applicantPhoneNumber: userCase?.applicantPhoneNumber,
      applicantHomeNumber: userCase?.applicantHomeNumber,
      applicantAddress1: userCase?.applicantAddress1,
      applicantAddress2: userCase?.applicantAddress2,
      applicantAddressTown: userCase?.applicantAddressTown,
      applicantAddressCountry: 'United Kingdom',
      selectedCourtId: userCase.selectedCourtId ?? '',
      applicantAddressPostcode: userCase?.applicantAddressPostcode,
      applicantApplicationFormDocuments: userCase?.applicantApplicationFormDocuments ?? [],
      applicantAdditionalDocuments: userCase?.applicantAdditionalDocuments ?? [],
      applicantStatementOfTruth: userCase?.applicantStatementOfTruth,
      paymentServiceRequestReferenceNumber: userCase?.paymentDetails?.serviceRequestReference,
      paymentReferenceNumber: userCase?.paymentDetails?.payment_reference,
      helpWithFeesReferenceNumber: userCase?.helpWithFeesReferenceNumber,
    }),
  };
};

export const mapUpdateCaseResponseData = (response: CaseData): UpdateCaseResponse => {
  const applicationData: Case = response?.dssCaseData ? JSON.parse(response.dssCaseData) : {};

  return {
    ...mapCreateCaseResponseData(response),
    applicantFirstName: applicationData?.applicantFirstName,
    applicantLastName: applicationData?.applicantLastName,
    applicantDateOfBirth: applicationData?.applicantDateOfBirth,
    applicantEmailAddress: applicationData?.applicantEmailAddress,
    applicantPhoneNumber: applicationData?.applicantPhoneNumber,
    applicantHomeNumber: applicationData.applicantHomeNumber,
    applicantAddress1: applicationData?.applicantAddress1,
    applicantAddress2: applicationData?.applicantAddress2,
    applicantAddressTown: applicationData?.applicantAddressTown,
    applicantAddressCountry: applicationData?.applicantAddressCountry,
    applicantAddressPostcode: applicationData?.applicantAddressPostcode,
    whomYouAreApplying: applicationData.whomYouAreApplying,
    namedApplicant: applicationData.namedApplicant,
    contactPreferenceType: applicationData.contactPreferenceType,
    applicantApplicationFormDocuments: applicationData.applicantApplicationFormDocuments,
    applicantAdditionalDocuments: applicationData.applicantAdditionalDocuments,
    selectedCourtId: applicationData.selectedCourtId,
    paymentServiceRequestReferenceNumber: applicationData.paymentServiceRequestReferenceNumber,
    paymentReferenceNumber: applicationData.paymentReferenceNumber,
    helpWithFeesReferenceNumber: applicationData.helpWithFeesReferenceNumber,
    hwfPaymentSelection: applicationData.hwfPaymentSelection,
    applicantStatementOfTruth: applicationData.applicantStatementOfTruth,
  };
};

const getCaseType = (edgeCaseTypeOfApplication: TYPE_OF_APPLICATION): CASE_TYPE_OF_APPLICATION => {
  return [TYPE_OF_APPLICATION.FGM, TYPE_OF_APPLICATION.FMPO].includes(edgeCaseTypeOfApplication)
    ? CASE_TYPE_OF_APPLICATION.FL401
    : CASE_TYPE_OF_APPLICATION.C100;
};

export type CreateCaseRequest = {
  edgeCaseTypeOfApplication: TYPE_OF_APPLICATION;
  applicantCaseName: string;
  caseTypeOfApplication: CASE_TYPE_OF_APPLICATION;
};

export interface CreateCaseResponse {
  id: string;
  caseTypeOfApplication: CASE_TYPE_OF_APPLICATION;
  edgeCaseTypeOfApplication: TYPE_OF_APPLICATION;
  state: State;
  applicantCaseName: string;
  lastModifiedDate: string;
  caseCreatedBy: string;
}

export interface UpdateCaseRequest {
  dssCaseData: string; // JSON string of Case properties
}
export interface UpdateCaseResponse extends CreateCaseResponse {
  whomYouAreApplying: UserRole;
  namedApplicant: YesOrNo;
  applicantFirstName: string;
  applicantLastName: string;
  applicantDateOfBirth: CaseDate;
  contactPreferenceType: ContactPreference;
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
  applicantStatementOfTruth?: YesOrNo;
}
