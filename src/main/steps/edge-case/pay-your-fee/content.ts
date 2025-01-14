import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { form as paymentSubmissionForm, generateContent as paymentGenerateContent } from '../../common/components/payment-submit';
export * from './routeGuard';

const fullNameFormFields = paymentSubmissionForm.fields as FormFields;

const PAY_YOUR_FEE_FILE = 'pay-your-fee';

export const form: FormContent = {
  fields: () => {
    return {
      hwfPaymentSelection: fullNameFormFields.hwfFields
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader(PAY_YOUR_FEE_FILE);
  const translations = resourceLoader.getFileContents().translations;
  const errors = resourceLoader.getFileContents().errors;

  const en = () => {
    return {
      ...translations.en,
      errors: {
        ...errors.en,
      },
    };
  };
  const cy = () => {
    return {
      ...translations.cy,
      errors: {
        ...errors.cy,
      },
    };
  };

  const languages = {
    en,
    cy,
  };
  const translationContent = languages[content.language]();
  const paymentContent = paymentGenerateContent(content);
  return {
    ...paymentContent,
    ...translationContent,
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}) },
  };
};
