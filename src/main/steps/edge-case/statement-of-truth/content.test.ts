import { FormContent, FormFields, FormOptions, LanguageLookup } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';
import { generateContent } from '../statement-of-truth/content';

jest.mock('../../../app/form/validation');

const STATEMENT_OF_TRUTH_TRANSLATION_FILE = 'statement-of-truth';

const resourceLoader = new ResourceReader();
resourceLoader.Loader(STATEMENT_OF_TRUTH_TRANSLATION_FILE);
const translations = resourceLoader.getFileContents().translations;
const enContent = translations['en'];
const cyContent = translations['cy'];

describe('statement-of-truth', () => {
  const commonContent = { language: 'en' } as CommonContent;

  let generatedContent;
  let form;
  let fields;

  beforeEach(() => {
    generatedContent = generateContent(commonContent);
    form = generatedContent.form as FormContent;
    fields = form.fields as FormFields;
  });

  test('should return correct content in English', () => {
    expect(generatedContent.serviceName).toEqual(enContent.serviceName);
    expect(generatedContent.statementOfTruthLabel).toEqual(enContent.statementOfTruthLabel);
    expect(generatedContent.confirmStatement).toEqual(enContent.confirmStatement);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct content in Welsh', () => {
    generatedContent = generateContent({ ...commonContent, language: 'cy' });
    expect(generatedContent.serviceName).toEqual(cyContent.serviceName);
    expect(generatedContent.statementOfTruthLabel).toEqual(cyContent.statementOfTruthLabel);
    expect(generatedContent.confirmStatement).toEqual(cyContent.confirmStatement);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });

  /* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
  test('should contain Statement of Truth fields', () => {
    generatedContent = generateContent(commonContent);
    const field = fields.applicantStatementOfTruth as FormOptions;
    expect(field.type).toBe('checkboxes');
    expect(field.classes).toBe('govuk-checkboxes');
    expect((field.label as Function)(generatedContent)).toBe(enContent.label);
    expect((field.values[0].label as LanguageLookup)(generatedContent)).toBe(enContent.statementOfTruthLabel);
    expect(field.validator).toBe(isFieldFilledIn);

    const confirmStatementField = fields.confirmStatement as FormOptions;
    expect(confirmStatementField.type).toBe('label');
    expect((confirmStatementField.label as LanguageLookup)(generatedContent)).toBe(enContent.confirmStatement);
  });

  test('should contain continue button', () => {
    expect((form.submit.text as Function)(generateContent(commonContent))).toBe(enContent.continue);
  });
});
/* eslint-enable @typescript-eslint/ban-types */
