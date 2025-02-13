import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { FormContent, FormFields, FormOptions } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';

import { generateContent } from './content';

jest.mock('../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader('user-role');
const translations = resourceLoader.getFileContents().translations;
const errors = resourceLoader.getFileContents().errors;

const EN = 'en';
const CY = 'cy';

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

/* eslint-disable @typescript-eslint/ban-types */
describe('role-type content', () => {
  const commonContent = {
    language: EN,
    userCase: { edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.PARENTAL_ORDER },
  } as CommonContent;
  const commonContent1 = { language: EN, userCase: {} } as CommonContent;
  test('should return correct english content', () => {
    const generatedContent = generateContent(commonContent);
    expect(generatedContent.continue).toEqual(enContent.continue);
    expect(generatedContent.label).toEqual(enContent.label);
    expect(generatedContent.serviceName).toEqual(enContent.serviceName);
    expect(generatedContent.one).toEqual(enContent.one);
    expect(generatedContent.two).toEqual(enContent.two);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct welsh content', () => {
    const generatedContent = generateContent({ ...commonContent, language: CY });
    expect(generatedContent.continue).toEqual(cyContent.continue);
    expect(generatedContent.label).toEqual(cyContent.label);
    expect(generatedContent.serviceName).toEqual(cyContent.serviceName);
    expect(generatedContent.one).toEqual(cyContent.one);
    expect(generatedContent.two).toEqual(cyContent.two);
    expect(generatedContent.three).toEqual(cyContent.three);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });

  test('should contain whomYouAreApplying field', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    const fields = form.fields as FormFields;
    const whomYouAreApplyingField = fields.whomYouAreApplying as FormOptions;
    expect(whomYouAreApplyingField.type).toBe('radios');
    expect(whomYouAreApplyingField.classes).toBe('govuk-radios');
    expect((whomYouAreApplyingField.label as Function)(generatedContent)).toBe(enContent.label);
    expect((whomYouAreApplyingField.values[0].label as Function)(generatedContent)).toBe(enContent.self);
    expect((whomYouAreApplyingField.values[1].label as Function)(generatedContent)).toBe(enContent.forCourtStaff);
    const generatedContent1 = generateContent(commonContent1);
    const form1 = generatedContent1.form as FormContent;
    const fields1 = form1.fields as FormFields;
    const whomYouAreApplyingField1 = fields1.whomYouAreApplying as FormOptions;
    expect(whomYouAreApplyingField1.type).toBe('radios');
    expect(whomYouAreApplyingField1.classes).toBe('govuk-radios');
    expect((whomYouAreApplyingField1.label as Function)(generatedContent)).toBe(enContent.label);
    expect((whomYouAreApplyingField1.values[0].label as Function)(generatedContent)).toBe(enContent.self);
    expect((whomYouAreApplyingField1.values[1].label as Function)(generatedContent)).toBe(enContent.forSomeone);
    expect((whomYouAreApplyingField1.values[2].label as Function)(generatedContent)).toBe(enContent.forCourtStaff);
  });

  test('should contain continue button', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    expect((form.submit.text as Function)(generatedContent)).toEqual('Continue');
  });
});
/* eslint-enable @typescript-eslint/ban-types */
