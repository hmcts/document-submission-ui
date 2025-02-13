import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { loadResources } from '../util';

export * from './routeGuard';

const STATEMENT_OF_TRUTH_TRANSLATION_FILE = 'statement-of-truth';

export const form: FormContent = {
  fields: {
    applicantStatementOfTruth: {
      type: 'checkboxes',
      classes: 'govuk-checkboxes',
      label: l => l.label,
      values: [{ label: l => l.statementOfTruthLabel, value: 'Yes' }],
      validator: isFieldFilledIn,
    },
    confirmStatement: {
      type: 'label',
      label: l => l.confirmStatement,
    },
  },
  submit: {
    classes: 'govuk-!-margin-top-5',
    text: s => s.submit,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = loadResources(STATEMENT_OF_TRUTH_TRANSLATION_FILE);
  const translations = resourceLoader.getFileContents().translations[content.language];
  const typeOfApplication = content.userCase?.edgeCaseTypeOfApplication;

  return {
    ...translations,
    submit: [TYPE_OF_APPLICATION.FGM, TYPE_OF_APPLICATION.FMPO].includes(typeOfApplication!)
      ? translations.submitApplication
      : translations.continue ?? translations.continue,
    form,
  };
};
