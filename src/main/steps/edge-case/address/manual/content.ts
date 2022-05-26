import { TranslationFn } from '../../../../app/controller/GetController';
import { FormContent, FormFields, FormFieldsFn } from '../../../../app/form/Form';
import { ResourceReader } from '../../../../modules/resourcereader/ResourceReader';
import {
  form as manualAddressForm,
  generateContent as manualAddressGenerateContent,
} from '../../../common/components/address-manual';

const manualAddressFormFields = manualAddressForm.fields as FormFields;

export const form: FormContent = {
  ...manualAddressForm,
  fields: () => {
    return {
      applicant1Address1: manualAddressFormFields.address1,
      applicant1Address2: manualAddressFormFields.address2,
      applicant1AddressTown: manualAddressFormFields.addressTown,
      applicant1AddressCounty: manualAddressFormFields.addressCounty,
      applicant1AddressPostcode: manualAddressFormFields.addressPostcode,
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader('manual-address');
  const Translations = resourceLoader.getFileContents().translations;
  const errors = resourceLoader.getFileContents().errors;

  const en = () => {
    return {
      ...Translations.en,
      errors: {
        ...errors.en,
      },
    };
  };
  const cy = () => {
    return {
      ...Translations.cy,
      errors: {
        ...errors.cy,
      },
    };
  };

  const languages = {
    en,
    cy,
  };

  const manualAddressContent = manualAddressGenerateContent(content);
  const translations = languages[content.language]();

  return {
    ...manualAddressContent,
    ...translations,
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}) },
  };
};
