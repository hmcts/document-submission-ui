import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { loadResources } from '../util';

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = loadResources('help-with-fee');
  const translations = resourceLoader.getFileContents().translations[content.language];

  return {
    ...translations,
    form,
  };
};
