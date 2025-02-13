import languageAssertions from '../../../../../test/unit/utils/languageAssertions';
import { FormContent } from '../../../../app/form/Form';
import { ResourceReader } from '../../../../modules/resourcereader/ResourceReader';
import { CommonContent, generatePageContent } from '../../../common/common.content';

import { generateContent } from './content';

jest.mock('../../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader('upload-your-documents');
const translations = resourceLoader.getFileContents().translations;

const EN = 'en';

const enContent = {
  ...translations.en,
};

const cyContent = {
  ...translations.cy,
};

const commonContent = { language: EN } as CommonContent;
/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('Upload content', () => {
  test('should return the correct content for language = en', () => {
    languageAssertions('en', enContent, () => generateContent(commonContent));
  });

  test('should return the correct content for language = cy', () => {
    languageAssertions('cy', cyContent, () => generateContent({ ...commonContent, language: 'cy' }));
  });

  test('should contain submit button', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    expect((form.submit.text as Function)(generatePageContent({ language: EN }))).toBe('Continue');
  });

  test('should generate uploadedDocuments for template', () => {
    const generatedContent = generateContent({
      ...commonContent,
      userCase: {
        applicantApplicationFormDocuments: [
          { document_filename: 'file1', document_url: '/url1/123', document_binary_url: '/url1/123/binary' },
          { document_filename: 'file2', document_url: '/url2/1234', document_binary_url: '/url2/1234/binary' },
        ],
      },
    }) as any;
    expect(generatedContent.fileUploadConfig.uploadedFiles).toStrictEqual([
      { filename: 'file1', fileremoveUrl: '/upload/upload-your-documents/123?' },
      { filename: 'file2', fileremoveUrl: '/upload/upload-your-documents/1234?' },
    ]);
  });
});
