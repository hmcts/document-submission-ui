import { FormContent, FormFields } from '../../../../app/form/Form';
import { ResourceReader } from '../../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../../common/common.content';
import {
  generateContent as generateSelectAddressContent,
  form as selectAddressForm,
} from '../../../common/components/address-select';

import { generateContent } from './content';

const resourceLoader = new ResourceReader();
resourceLoader.Loader('select-address');
const translations = resourceLoader.getFileContents().translations;

const EN = 'en';
const CY = 'cy';

const enContent = {
  ...translations.en,
};

const cyContent = {
  ...translations.cy,
};

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('applicant > address > select > content', () => {
  const commonContent = { language: EN, userCase: {}, addresses: [] as any[] } as CommonContent;
  const commonContent1 = { language: EN } as CommonContent;
  let generatedContent;
  let generatedContentWithoutUsercase;
  let form1;

  beforeEach(() => {
    generatedContent = generateContent(commonContent);
    delete commonContent1.userCase;
    generatedContentWithoutUsercase = generateContent(commonContent1);
    form1 = generatedContentWithoutUsercase.form as FormContent;
  });

  test('should return correct english content', () => {
    const selectAddressContent = generateSelectAddressContent(commonContent);
    expect(generatedContent.section).toEqual(enContent.section);
    expect(generatedContent.title).toEqual(enContent.title);
    expect(generatedContent.errors).toEqual({
      applicantSelectAddress: (selectAddressContent.errors as any).selectAddress,
    });
    expect(generatedContent.changePostCodeUrl).toEqual('/address/lookup');
    expect(generatedContent.cantFindAddressUrl).toEqual('/address/manual');
  });

  test('should return correct welsh content', () => {
    const selectAddressContent = generateSelectAddressContent({ ...commonContent, language: CY });
    generatedContent = generateContent({ ...commonContent, language: CY });
    expect(generatedContent.section).toEqual(cyContent.section);
    expect(generatedContent.title).toEqual(cyContent.title);
    expect(generatedContent.errors).toEqual({
      applicantSelectAddress: (selectAddressContent.errors as any).selectAddress,
    });
    expect(generatedContent.changePostCodeUrl).toEqual('/address/lookup');
    expect(generatedContent.cantFindAddressUrl).toEqual('/address/manual');
  });

  test('should contain applicantSelectAddress field', () => {
    const selectAddressFormFields = selectAddressForm.fields as FormFields;
    const fields = generatedContent.form.fields as FormFields;
    expect(fields.applicantSelectAddress).toEqual(selectAddressFormFields.selectAddress);
  });

  it('should have applicantSelectAddress label when language: en', () => {
    expect(generatedContent.section).toBe(enContent.section);
  });

  it('should have applicantSelectAddress label when language: cy', () => {
    const commonContentCy = { language: CY, userCase: {} } as CommonContent;

    const generatedContentCy = generateContent(commonContentCy);
    expect(generatedContentCy.section).toBe(cyContent.section);
  });

  test('should contain continue button', () => {
    const form = generatedContent.form as FormContent;
    expect((form.submit.text as Function)(generatedContent)).toEqual('Continue');
    expect((form1.submit.text as Function)(generatedContentWithoutUsercase)).toEqual('Continue');
  });
});
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
