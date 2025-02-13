import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { form as fullNameForm, generateContent as fullNameGenerateContent } from '../../common/components/full-name';

const fullNameFormFields = fullNameForm.fields as FormFields;

const FULL_NAME = 'full-name';

export const form: FormContent = {
  fields: () => {
    return {
      applicantFirstName: fullNameFormFields.firstNames,
      applicantLastName: fullNameFormFields.lastNames,
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader(FULL_NAME);
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
  const fullNameContent = fullNameGenerateContent(content);
  return {
    ...fullNameContent,
    ...translationContent,
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}, content.additionalData?.req) },
  };
};
