import { mockUserCase1 } from '../../../test/unit/utils/mockUserCase';

import {
  mapCreateCaseResponseData,
  mapUpdateCaseResponseData,
  prepareCaseRequestData,
  prepareUpdateCaseRequestData,
} from './api-utility';
import { TYPE_OF_APPLICATION } from './definition';

describe('api-utility', () => {
  const data = {
    ...mockUserCase1,
    applicantFirstName: 'y',
    applicantLastName: 'z',
    edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.FMPO,
    id: '1',
    state: '',
    caseTypeOfApplication: '',
    applicantCaseName: '',
    lastModifiedDate: '',
    caseCreatedBy: '',
    namedApplicant: '',
    applicantDateOfBirth: {
      day: '01',
      month: '01',
      year: '2000',
    },
    contactPreferenceType: '',
    applicantEmailAddress: '',
    applicantPhoneNumber: '',
    applicantHomeNumber: '',
    applicantAddress1: '',
    applicantAddress2: '',
    applicantAddressTown: '',
    applicantAddressPostcode: '',
    applicantStatementOfTruth: '',
    paymentDetails: {
      serviceRequestReference: '',
      payment_reference: '',
    },
    applicants: [
      {
        firstName: '',
        lastName: '',
        dateOfBirth: {
          day: '01',
          month: '01',
          year: '2000',
        },
        email: '',
        phoneNumber: '',
        address: {
          AddressLine1: '',
          AddressLine2: '',
          PostTown: '',
          Country: '',
          PostCode: '',
        },
      },
    ],
    dssUploadedDocuments: [
      {
        id: 'string',
        value: {
          document_url: 'string',
          document_filename: 'string',
          document_binary_url: 'string',
        },
      },
    ],
    dssUploadedAdditionalDocuments: [
      {
        id: 'string',
        value: {
          document_url: 'string',
          document_filename: 'string',
          document_binary_url: 'string',
        },
      },
    ],
  };
  test('prepareCaseRequestData', () => {
    expect(prepareCaseRequestData(data)).toStrictEqual({
      applicantCaseName: 'y z',
      caseTypeOfApplication: 'FL401',
      edgeCaseTypeOfApplication: 'FMPO',
    });
    expect(
      prepareCaseRequestData({ ...data, edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.DECLARATION_OF_PARENTAGE })
    ).toStrictEqual({ applicantCaseName: 'y z', caseTypeOfApplication: 'C100', edgeCaseTypeOfApplication: 'DOP' });
  });
  test('mapCreateCaseResponseData', () => {
    expect(mapCreateCaseResponseData(data)).toStrictEqual({
      applicantCaseName: '',
      edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.FMPO,
      id: '1',
      state: '',
      caseTypeOfApplication: '',
      lastModifiedDate: '',
      caseCreatedBy: '',
    });
  });
  test('prepareUpdateCaseRequestData', () => {
    expect(prepareUpdateCaseRequestData(data)).toStrictEqual({
      dssCaseData:
        '{"edgeCaseTypeOfApplication":"FMPO","namedApplicant":"No","caseTypeOfApplication":"FL401","applicantFirstName":"y","applicantLastName":"z","applicantDateOfBirth":{"day":"01","month":"01","year":"2000"},"contactPreference":"","applicantEmailAddress":"","applicantPhoneNumber":"","applicantHomeNumber":"","applicantAddress1":"","applicantAddress2":"","applicantAddressTown":"","applicantAddressCountry":"United Kingdom","selectedCourtId":"","applicantAddressPostcode":"","applicantApplicationFormDocuments":[],"applicantAdditionalDocuments":[],"applicantStatementOfTruth":"","paymentServiceRequestReferenceNumber":"","paymentReferenceNumber":""}',
    });
  });
  test('mapUpdateCaseResponseData', () => {
    expect(mapUpdateCaseResponseData(data)).toStrictEqual({
      applicantAddress1: undefined,
      applicantAddress2: undefined,
      applicantAddressCountry: undefined,
      applicantAddressPostcode: undefined,
      applicantAddressTown: undefined,
      applicantApplicationFormDocuments: undefined,
      applicantFirstName: undefined,
      applicantLastName: undefined,
      applicantPhoneNumber: undefined,
      caseTypeOfApplication: '',
      edgeCaseTypeOfApplication: 'FMPO',
      applicantAdditionalDocuments: undefined,
      id: '1',
      lastModifiedDate: '',
      state: '',
      applicantCaseName: '',
      applicantDateOfBirth: undefined,
      applicantEmailAddress: undefined,
      caseCreatedBy: '',
      applicantHomeNumber: undefined,
      applicantStatementOfTruth: undefined,
      contactPreferenceType: undefined,
      helpWithFeesReferenceNumber: undefined,
      hwfPaymentSelection: undefined,
      namedApplicant: undefined,
      paymentReferenceNumber: undefined,
      paymentServiceRequestReferenceNumber: undefined,
      selectedCourtId: undefined,
      whomYouAreApplying: undefined,
    });
  });
});
