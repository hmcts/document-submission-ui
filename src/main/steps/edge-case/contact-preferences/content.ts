import { ContactPreference } from '../../../app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';

const CONTACT_PREFERENCES_TRANSLATION_FILE = 'contact-preferences';

export const form: FormContent = {
  fields: {
    contactPreferenceType: {
      type: 'radios',
      classes: 'govuk-radios',
      label: l => l.label,
      hint: h => h.hint,
      values: [
        { label: l => l.accountOwner, value: ContactPreference.ACCOUNT_OWNER },
        {
          label: l => l.namedPerson,
          value: ContactPreference.NAMED_PERSON,
        },
      ],
      validator: isFieldFilledIn,
    },
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader(CONTACT_PREFERENCES_TRANSLATION_FILE);
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
  const languageTranslation = languages[content.language]();
  return {
    ...languageTranslation,
    form,
  };
};
