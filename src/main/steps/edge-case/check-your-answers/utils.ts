import { getFormattedDate } from '../../../app/case/answers/formatDate';
import { CaseWithId } from '../../../app/case/case';
import { ContactPreference } from '../../../app/case/definition';
import { getFormattedAddress } from '../../../app/case/formatter/address';
import { AppSession } from '../../../app/controller/AppRequest';
import { PageContent } from '../../../app/controller/GetController';
import { parseUrl } from '../../../steps/common/url-parser';
import * as Urls from '../../../steps/urls';

interface GovUkNunjucksSummary {
  key: {
    text?: string;
    html?: string;
    classes?: string;
  };
  value: {
    text?: string;
    html?: string;
  };
  actions?: {
    items?: [
      {
        href: string;
        text: string;
        visuallyHiddenText: string;
      }
    ];
  };
  classes?: string;
}

interface SummaryListRow {
  key?: string;
  keyHtml?: string;
  value?: string;
  valueHtml?: string;
  changeUrl?: string;
  classes?: string;
}

interface SummaryList {
  title: string;
  rows: GovUkNunjucksSummary[];
}

type SummaryListContent = PageContent & {
  sectionTitles: Record<string, string>;
  keys: Record<string, string>;
  language?: string;
};

const getSectionSummaryList = (rows: SummaryListRow[], content: PageContent): GovUkNunjucksSummary[] => {
  return rows.map(item => {
    const changeUrl = item.changeUrl;
    return {
      key: { ...(item.key ? { text: item.key } : {}), ...(item.keyHtml ? { html: item.keyHtml } : {}) },
      value: { ...(item.value ? { text: item.value } : {}), ...(item.valueHtml ? { html: item.valueHtml } : {}) },
      ...(changeUrl
        ? {
            actions: {
              items: [
                {
                  href: changeUrl, //
                  text: content.change as string,
                  visuallyHiddenText: `${item.key}`,
                },
              ],
            },
          }
        : {}),
      ...(item.classes ? { classes: item.classes } : {}),
    };
  });
};

/* eslint-disable import/namespace */
export const ApplicantSummaryList = (
  { sectionTitles, keys, ...content }: SummaryListContent,
  session: AppSession,
  language: string
): SummaryList | undefined => {
  const caseData = session.userCase;
  const sectionTitle = sectionTitles.applicantDetails;
  const courtDetails = caseData.selectedCourtId
    ? session.applicationSettings?.availableCourts?.find(court => court.epimms_id === caseData.selectedCourtId)
    : null;

  const SummaryData = [
    {
      key: keys.fullName,
      value: `${caseData.applicantFirstName} ${caseData.applicantLastName}`,
      changeUrl: Urls.FULL_NAME,
    },
    {
      key: keys.dateOfBirth,
      value: getFormattedDate(caseData.applicantDateOfBirth, language),
      changeUrl: Urls.DATE_OF_BIRTH,
    },
    {
      key: keys.address,
      valueHtml: getFormattedAddress(caseData),
      changeUrl: Urls.FIND_ADDRESS,
    },
    {
      key: keys.recievingEmail,
      value:
        caseData.contactPreferenceType === ContactPreference.ACCOUNT_OWNER
          ? keys['emailToAccountOwner']
          : keys['emailToNamedPerson'],
      changeUrl: Urls.CONTACT_PREFERENCES,
    },
    {
      key: keys.namedPersonEmail,
      value: caseData.applicantEmailAddress,
      changeUrl: Urls.EMAIL_ADDRESS,
    },
    {
      key: keys.namedPersonTel,
      value: caseData.applicantHomeNumber,
      changeUrl: Urls.CONTACT_DETAILS,
    },
    {
      key: keys.namedPersonMob,
      value: caseData.applicantPhoneNumber,
      changeUrl: Urls.CONTACT_DETAILS,
    },
  ];

  if (courtDetails) {
    SummaryData.push({
      key: keys.selectedCourt,
      value: courtDetails.court_name,
      changeUrl: Urls.SELECT_COURT,
    });
  }
  /** Removes entry in @summarydata if user is not a named user */

  return {
    title: sectionTitle,
    rows: getSectionSummaryList(SummaryData, content),
  };
};

/* eslint-disable import/namespace */
export const UploadFormSummary = (
  { sectionTitles, keys, ...content }: SummaryListContent,
  uploadedDocuments: Partial<any>
): SummaryList | undefined => {
  const ListOfUploadedDocuments = uploadedDocuments
    .map((document): string => {
      return document.document_filename + '';
    })
    .toString()
    .split(',')
    .join('<div class="govuk-!-margin-top-3"></div>');

  const SummaryData = [
    {
      key: keys.uploadDocuments,
      valueHtml: ListOfUploadedDocuments,
      changeUrl: parseUrl(Urls['UPLOAD_YOUR_DOCUMENTS']).url,
    },
  ];

  /** Removes entry in @summarydata if user is not a named user */

  return {
    title: 'List of forms uploaded ',
    rows: getSectionSummaryList(SummaryData, content),
  };
};

/* eslint-disable import/namespace */
export const UserRole = (
  { sectionTitles, keys, ...content }: SummaryListContent,
  userCase: Partial<CaseWithId>
): SummaryList | undefined => {
  const SummaryData = [
    {
      key: keys['user-role'],
      value: userCase.whomYouAreApplying ? keys[userCase.whomYouAreApplying] : '',
      changeUrl: Urls.USER_ROLE,
    },
  ];

  /** Removes entry in @summarydata if user is not a named user */

  return {
    title: 'Determine User’s Role',
    rows: getSectionSummaryList(SummaryData, content),
  };
};

/* eslint-disable import/namespace */
export const AdditonalFormSummary = (
  { sectionTitles, keys, ...content }: SummaryListContent,
  addDocuments: Partial<any>
): SummaryList | undefined => {
  const ListOfAdditionalDocuments = addDocuments
    .map((document): string => {
      return document.document_filename + '';
    })
    .toString()
    .split(',')
    .join('<div class="govuk-!-margin-top-3"></div>');

  const SummaryData = [
    {
      key: keys.additionalDocuments,
      valueHtml: ListOfAdditionalDocuments,
      changeUrl: parseUrl(Urls['ADDITIONAL_DOCUMENTS_UPLOAD']).url,
    },
  ];

  /** Removes entry in @summarydata if user is not a named user */

  return {
    title: 'List of Documents uploaded  ',
    rows: getSectionSummaryList(SummaryData, content),
  };
};

/* eslint-disable import/namespace */
export const TypeOfApplication = (
  { sectionTitles, keys, ...content }: SummaryListContent,
  userCase: Partial<CaseWithId>
): SummaryList | undefined => {
  const typeOfApplication = userCase?.edgeCaseTypeOfApplication as string;
  const typeOfApplicationValue = keys[typeOfApplication];

  const SummaryData = [
    {
      key: keys.typeOfApplication,
      value: typeOfApplicationValue,
      changeUrl: Urls['TYPE_OF_APPLICATION_URL'],
    },
  ];

  /** Removes entry in @summarydata if user is not a named user */

  return {
    title: keys.typeOfApplication,
    rows: getSectionSummaryList(SummaryData, content),
  };
};
