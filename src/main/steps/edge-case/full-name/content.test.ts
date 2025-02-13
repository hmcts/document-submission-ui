import { FormContent, FormFields, FormFieldsFn, FormOptions } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';
import { form as fullNameForm } from '../../common/components/full-name';

import { generateContent } from './content';

jest.mock('../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader('full-name');
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

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('Applicant > full-name', () => {
  const fullNameFormFields = fullNameForm.fields as FormFields;
  const commonContent = { language: EN, userCase: {} } as CommonContent;
  const commonContent1 = { language: EN } as CommonContent;
  let generatedContent;
  let form;
  let fields;
  let generatedContent1;
  let form1;
  let fields1;
  beforeEach(() => {
    generatedContent = generateContent(commonContent);
    form = generatedContent.form as FormContent;
    fields = form.fields as FormFields;
    delete commonContent1.userCase;
    generatedContent1 = generateContent(commonContent1);
    form1 = generatedContent1.form as FormContent;
    fields1 = form1.fields as FormFieldsFn;
  });

  test('should return correct english content', () => {
    expect(generatedContent.title).toEqual(enContent.title);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct welsh content', () => {
    generatedContent = generateContent({ ...commonContent, language: CY });
    expect(generatedContent.title).toEqual(cyContent.title);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });

  test('should contain firstNames field', () => {
    const firstNamesField = fields.applicantFirstName as FormOptions;
    expect(firstNamesField).toEqual(fullNameFormFields.firstNames);
    const firstNamesField1 = fields1.applicantFirstName as FormOptions;
    expect(firstNamesField1).toEqual(fullNameFormFields.firstNames);
  });

  test('should contain lastNames field', () => {
    const lastNamesField = fields.applicantLastName as FormOptions;
    expect(lastNamesField).toEqual(fullNameFormFields.lastNames);
  });

  test('should contain continue button', () => {
    expect((form.submit.text as Function)(generatedContent)).toEqual('Continue');
  });
  test('should contain continue button1', () => {
    expect((form1.submit.text as Function)(generatedContent1)).toEqual('Continue');
  });
});
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
