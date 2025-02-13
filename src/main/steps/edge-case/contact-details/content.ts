import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isPhoneNoValid } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';

export const form: FormContent = {
  fields: {
    applicantHomeNumber: {
      type: 'text',
      classes: 'govuk-input',
      label: l2 => l2.homePhoneLabel,
      validator: (value, formData) => {
        return !(value as string)?.length && !formData?.applicantPhoneNumber?.length
          ? 'atleastOneRequired'
          : isPhoneNoValid(value);
      },
    },
    applicantPhoneNumber: {
      type: 'text',
      classes: 'govuk-input',
      label: ml => ml.mobilePhoneLabel,
      validator: (value, formData) => {
        return !(value as string)?.length && !formData?.applicantHomeNumber?.length
          ? 'atleastOneRequired'
          : isPhoneNoValid(value);
      },
    },
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader('contact-details');
  const translations = resourceLoader.getFileContents();

  return {
    ...translations?.translations?.[content.language],
    errors: {
      ...translations?.errors?.[content.language],
    },
    form,
  };
};
