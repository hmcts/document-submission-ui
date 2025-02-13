import { FormContent } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';

import { generateContent } from './content';

jest.mock('../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader('help-with-fee');
const translations = resourceLoader.getFileContents().translations;
const enContent = translations['en'];
const cyContent = translations['cy'];

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('help-with-fees > content', () => {
  const commonContent = { language: 'en', userCase: {} } as CommonContent;
  let generatedContent;
  let form;
  beforeEach(() => {
    generatedContent = generateContent(commonContent);
    form = generatedContent.form as FormContent;
  });

  test('should return correct english content', () => {
    expect(generatedContent.title).toEqual(enContent.title);
    expect(generatedContent.errors).toEqual(enContent.errors);
  });

  test('should return correct welsh content', () => {
    generatedContent = generateContent({ ...commonContent, language: 'cy' });
    expect(generatedContent.title).toEqual(cyContent.title);
    expect(generatedContent.errors).toEqual(cyContent.errors);
  });

  test('should contain continue button', () => {
    expect((form.submit.text as Function)(generatedContent)).toEqual('Save and sign out');
  });
});
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
