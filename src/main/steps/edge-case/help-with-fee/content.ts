import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFieldsFn } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { generateContent as fullNameGenerateContent } from '../../common/components/full-name';

const HELP_WITH_FEE_FILE = 'help-with-fee';

export const form: FormContent = {
  fields: () => {
    return {
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader(HELP_WITH_FEE_FILE);
  const translations = resourceLoader.getFileContents().translations;

  const en = () => {
    return {
      ...translations.en,
    };
  };
  const cy = () => {
    return {
      ...translations.cy,
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
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}) },
  };
};
