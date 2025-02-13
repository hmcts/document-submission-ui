import _ from 'lodash';

import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../../steps/common/common.content';

import { AdditonalFormSummary, ApplicantSummaryList, TypeOfApplication, UploadFormSummary, UserRole } from './utils';
const resourceLoader = new ResourceReader();
resourceLoader.Loader('check-your-answers');
const Translations = resourceLoader.getFileContents().translations;

export const enContent = {
  ...Translations.en,
};

const en = (content: CommonContent) => {
  const userCase = content.userCase!;
  const caseDocuments = userCase.applicantApplicationFormDocuments;
  const additionalDocuments = userCase.applicantAdditionalDocuments;
  const sections = [
    TypeOfApplication(enContent, userCase),
    UserRole(enContent, userCase),
    ApplicantSummaryList(enContent, _.get(content, 'additionalData.req.session'), content.language),
  ];

  if (caseDocuments?.length) {
    sections.push(UploadFormSummary(enContent, caseDocuments));
  }

  if (additionalDocuments?.length) {
    sections.push(AdditonalFormSummary(enContent, additionalDocuments));
  }

  return {
    ...enContent,
    language: content.language,
    sections,
  };
};

const cyContent: typeof enContent = {
  ...Translations.cy,
};

const cy: typeof en = (content: CommonContent) => {
  const userCase = content.userCase!;
  const caseDocuments = userCase.applicantApplicationFormDocuments;
  const additionalDocuments = userCase.applicantAdditionalDocuments;

  const sections = [
    TypeOfApplication(cyContent, userCase),
    UserRole(cyContent, userCase),
    ApplicantSummaryList(cyContent, _.get(content, 'additionalData.req.session'), content.language),
  ];

  if (caseDocuments?.length) {
    sections.push(UploadFormSummary(cyContent, caseDocuments));
  }

  if (additionalDocuments?.length) {
    sections.push(AdditonalFormSummary(cyContent, additionalDocuments));
  }

  return {
    ...cyContent,
    language: content.language,
    sections,
  };
};

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.continue,
  },
};

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language](content);
  return {
    ...translations,
    form,
  };
};
