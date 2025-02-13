const mockIsFieldFilledIn = jest.fn();
const mockIsEmailValid = jest.fn();
const mockIsPhoneNoValid = jest.fn();

jest.mock('../../../app/form/validation', () => ({
  isFieldFilledIn: mockIsFieldFilledIn,
  isEmailValid: mockIsEmailValid,
  isPhoneNoValid: mockIsPhoneNoValid,
}));

import { FormContent, FormFields, FormOptions } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';

import { generateContent } from './content';
jest.mock('../../../app/form/validation');

const EN = 'en';
const CY = 'cy';
const commonContent = {
  language: EN,
} as CommonContent;

const resourceLoader = new ResourceReader();
resourceLoader.Loader('contact-details');
const translations = resourceLoader.getFileContents().translations;
const errors = resourceLoader.getFileContents().errors;

const enContent = {
  ...translations.en,
  errors: {
    ...errors.en,
  },
};

const cyContent = {
  ...translations.cy,
  errors: {
    ...errors.cy,
  },
};

describe('contact-number-content', () => {
  test('should return correct english content', () => {
    const generatedContent = generateContent({ ...commonContent });
    expect(generatedContent.continue).toEqual(enContent.continue);
    expect(generatedContent.serviceName).toEqual(enContent.serviceName);
    expect(generatedContent.homePhoneLabel).toEqual(enContent.homePhoneLabel);
    expect(generatedContent.mobilePhoneLabel).toEqual(enContent.mobilePhoneLabel);
    expect(generatedContent.homePhoneHint).toEqual(enContent.homePhoneHint);
    expect(generatedContent.mobilePhoneHint).toEqual(enContent.mobilePhoneHint);
    expect(generatedContent.homePhone).toEqual(enContent.homePhone);
    expect(generatedContent.mobilePhone).toEqual(enContent.mobilePhone);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct welsh content', () => {
    const generatedContent = generateContent({
      ...commonContent,
      language: CY,
    });

    expect(generatedContent.continue).toEqual(cyContent.continue);
    expect(generatedContent.serviceName).toEqual(cyContent.serviceName);
    expect(generatedContent.homePhoneLabel).toEqual(cyContent.homePhoneLabel);
    expect(generatedContent.mobilePhoneLabel).toEqual(cyContent.mobilePhoneLabel);
    expect(generatedContent.homePhoneHint).toEqual(cyContent.homePhoneHint);
    expect(generatedContent.mobilePhoneHint).toEqual(cyContent.mobilePhoneHint);
    expect(generatedContent.homePhone).toEqual(cyContent.homePhone);
    expect(generatedContent.mobilePhone).toEqual(cyContent.mobilePhone);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });
  /* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
  test('should contain submit button', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;

    expect((form.submit.text as Function)(generateContent({ ...commonContent, language: EN }))).toBe('Continue');
  });

  test('should call validation function', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    const fields = form.fields as FormFields;
    const mobilePhoneNumberOption = fields.applicantPhoneNumber as FormOptions;
    expect((mobilePhoneNumberOption.label as Function)(generatedContent)).toBe(enContent.mobilePhoneLabel);
    expect((mobilePhoneNumberOption.validator as Function)(null, mobilePhoneNumberOption)).toBe('atleastOneRequired');
    expect((mobilePhoneNumberOption.validator as Function)([''], mobilePhoneNumberOption)).toBe(undefined);
    const homePhoneNumberOption = fields.applicantHomeNumber as FormOptions;
    expect((homePhoneNumberOption.label as Function)(generatedContent)).toBe(enContent.homePhoneLabel);
    expect((homePhoneNumberOption.validator as Function)(null, homePhoneNumberOption)).toBe('atleastOneRequired');
    expect((homePhoneNumberOption.validator as Function)('12', homePhoneNumberOption)).toBe(undefined);
  });
});
