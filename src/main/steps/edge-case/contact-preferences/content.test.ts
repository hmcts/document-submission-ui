import { ContactPreference } from '../../../app/case/definition';
import { FormContent, FormFields, FormOptions } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';
import { generateContent } from '../contact-preferences/content';

jest.mock('../../../app/form/validation');

const CONTACT_PREFERENCES_TRANSLATION_FILE = 'contact-preferences';

const resourceLoader = new ResourceReader();
resourceLoader.Loader(CONTACT_PREFERENCES_TRANSLATION_FILE);
const translations = resourceLoader.getFileContents().translations;
const errors = resourceLoader.getFileContents().errors;

const EN = 'en';
const CY = 'cy';

const en = {
  ...translations.en,
  errors: {
    ...errors.en,
  },
};

const cy = {
  ...translations.cy,
  errors: {
    ...errors.cy,
  },
};

describe('contact-preferences', () => {
  const commonContent = { language: EN } as CommonContent;

  let generatedContent;
  let form;
  let fields;

  beforeEach(() => {
    generatedContent = generateContent(commonContent);
    form = generatedContent.form as FormContent;
    fields = form.fields as FormFields;
  });

  test('should return correct english content', () => {
    expect(generatedContent.serviceName).toEqual(en.serviceName);
    expect(generatedContent.label).toEqual(en.label);
    expect(generatedContent.accountOwner).toEqual(en.accountOwner);
    expect(generatedContent.namedPerson).toEqual(en.namedPerson);
    expect(generatedContent.bothReceiveEmail).toEqual(en.bothReceiveEmail);
    expect(generatedContent.errors).toEqual(en.errors);
  });

  test('should return correct welsh content', () => {
    generatedContent = generateContent({ ...commonContent, language: CY });
    expect(generatedContent.serviceName).toEqual(cy.serviceName);
    expect(generatedContent.label).toEqual(cy.label);
    expect(generatedContent.accountOwner).toEqual(cy.accountOwner);
    expect(generatedContent.namedPerson).toEqual(cy.namedPerson);
    expect(generatedContent.bothReceiveEmail).toEqual(cy.bothReceiveEmail);
    expect(generatedContent.errors).toEqual(cy.errors);
  });

  /* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
  test('should contain contactPreferenceType field', () => {
    generatedContent = generateContent(commonContent);
    const field = fields.contactPreferenceType as FormOptions;
    expect(field.type).toBe('radios');
    expect(field.classes).toBe('govuk-radios');
    expect((field.label as Function)(generatedContent)).toBe(en.label);

    expect((field.values[0].label as Function)(generatedContent)).toBe(en.accountOwner);
    expect(field.values[0].value).toBe(ContactPreference.ACCOUNT_OWNER);

    expect((field.values[1].label as Function)(generatedContent)).toBe(en.namedPerson);
    expect(field.values[1].value).toBe(ContactPreference.NAMED_PERSON);

    expect(field.validator).toBe(isFieldFilledIn);
  });

  test('should contain continue button', () => {
    expect((form.submit.text as Function)(generateContent(commonContent))).toBe(en.continue);
  });
});
