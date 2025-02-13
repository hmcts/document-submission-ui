import { FormContent, FormFields, FormOptions, LanguageLookup } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';
import { interpolate } from '../../common/string-parser';

import { generateContent } from './content';

jest.mock('../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader('pay-your-fee');
const translations = resourceLoader.getFileContents().translations;
const enContent = translations['en'];
const cyContent = translations['cy'];

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('pay your fee > content', () => {
  const commonContent = {
    language: 'en',
    userCase: {},
    additionalData: { req: { session: { errors: [] } } },
  } as unknown as CommonContent;
  let generatedContent;
  let form;
  let fields;

  beforeEach(() => {
    generatedContent = generateContent({ ...commonContent, userCase: { id: '123' } });
    form = generatedContent.form as FormContent;
    fields = form.fields as FormFields;
  });

  test('should return correct english content', () => {
    enContent.errors.paymentError.applicationNotSubmitted = interpolate(
      enContent.errors.paymentError.applicationNotSubmitted,
      { caseId: '123' }
    );
    expect(generatedContent.title).toEqual(enContent.title);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct welsh content', () => {
    generatedContent = generateContent({ ...commonContent, language: 'cy', userCase: { id: '123' } });
    cyContent.errors.paymentError.applicationNotSubmitted = interpolate(
      cyContent.errors.paymentError.applicationNotSubmitted,
      { caseId: '123' }
    );
    expect(generatedContent.title).toEqual(cyContent.title);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });

  test('should contain correct form fields', () => {
    const hwfPaymentSelectionFields = fields.hwfPaymentSelection as FormOptions;
    expect((hwfPaymentSelectionFields.values[0].label as LanguageLookup)(generatedContent)).toEqual(
      enContent.hwfTextOption
    );
    expect((hwfPaymentSelectionFields.values[1].label as LanguageLookup)(generatedContent)).toEqual(
      enContent.hwfReferenceNumberText
    );
    expect(hwfPaymentSelectionFields.validator).toBe(isFieldFilledIn);

    const helpWithFeesReferenceNumberFields = hwfPaymentSelectionFields.values[1].subFields
      ?.helpWithFeesReferenceNumber as FormOptions;
    expect((helpWithFeesReferenceNumberFields.label as LanguageLookup)(generatedContent)).toEqual(
      enContent.hwfReferenceInputText
    );
    expect((helpWithFeesReferenceNumberFields.hint as LanguageLookup)(generatedContent)).toEqual(
      enContent.explainNoHint
    );
    (helpWithFeesReferenceNumberFields.validator as Function)('test');
    expect(isFieldFilledIn).toHaveBeenCalledWith('test');
  });

  test('should contain continue button', () => {
    expect(generatedContent.continue).toEqual(enContent.continue);
  });

  test('should disable form when fee error present', () => {
    generatedContent = generateContent({
      ...commonContent,
      language: 'en',
      additionalData: { req: { session: { errors: [{ errorType: 'errorFetchingFee', propertyName: '*' }] } } },
    });
    expect(generatedContent.hasFeeError).toBeTruthy();
    expect(generatedContent.form.submit.disabled).toBeTruthy();
    expect(generatedContent.form.fields.hwfPaymentSelection.values[0].disabled).toBeTruthy();
  });
});
