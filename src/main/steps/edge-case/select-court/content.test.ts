import { FormContent, FormFields, FormInput } from '../../../app/form/Form';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { CommonContent } from '../../common/common.content';
import { SELECT_COURT } from '../../urls';

import { generateContent } from './content';

jest.mock('../../../app/form/validation');

const resourceLoader = new ResourceReader();
resourceLoader.Loader(SELECT_COURT);
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
  let commonContent = { language: EN, userCase: {} } as CommonContent;
  test('should return correct english content', () => {
    const generatedContent = generateContent(commonContent);
    expect(generatedContent.continue).toEqual(enContent.continue);
    expect(generatedContent.label).toEqual(enContent.label);
    expect(generatedContent.serviceName).toEqual(enContent.serviceName);
    expect(generatedContent.one).toEqual(enContent.one);
    expect(generatedContent.two).toEqual(enContent.two);
    expect(generatedContent.three).toEqual(enContent.three);
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

  test('should contain namedApplicant field', () => {
    //commonContent.additionalData!.req.session.userCase.hearingCollection = undefined;
    commonContent = {
      ...commonContent,
      additionalData: {
        req: {
          session: {
            applicationSettings: {
              availableCourts: [
                {
                  epimms_id: '',
                  court_name: '',
                },
              ],
            },
          },
        },
      },
    };
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    const fields = form.fields as FormFields;
    const selectedCourt = fields.selectedCourtId as FormInput;
    expect((selectedCourt.label as Function)(generatedContent)).toBe(enContent.label);
    expect((selectedCourt.options as Function)(generatedContent)).toStrictEqual([
      {
        selected: true,
        text: '-- Select a value --',
        value: '',
      },
      { selected: false, text: '', value: '' },
    ]);
    expect((selectedCourt.label as Function)(generatedContent)).toBe(enContent.label);
  });

  test('should contain continue button', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    expect((form?.submit?.text as Function)(generatedContent)).toBe(enContent.continue);
  });
});
/* eslint-enable @typescript-eslint/ban-types */
