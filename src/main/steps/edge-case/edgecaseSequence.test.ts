import { CaseWithId } from '../../app/case/case';
import { TYPE_OF_APPLICATION } from '../../app/case/definition';
import {
  ADDITIONAL_DOCUMENTS_UPLOAD,
  CHECK_YOUR_ANSWERS,
  CONTACT_DETAILS,
  CONTACT_PREFERENCES,
  DATE_OF_BIRTH,
  EMAIL_ADDRESS,
  FIND_ADDRESS,
  FULL_NAME,
  MANUAL_ADDRESS,
  SELECT_ADDRESS,
  STATEMENT_OF_TRUTH,
  TYPE_OF_APPLICATION_URL,
  UPLOAD_YOUR_DOCUMENTS,
  USER_ROLE,
} from '../urls';

import { edgecaseSequence } from './edgecaseSequence';

describe('Sequence must match respective path', () => {
  test('must match the path', () => {
    expect(edgecaseSequence).toHaveLength(20);

    expect(edgecaseSequence[0].url).toBe(TYPE_OF_APPLICATION_URL);
    expect(edgecaseSequence[0].getNextStep({})).toBe(USER_ROLE);

    expect(edgecaseSequence[1].url).toBe(USER_ROLE);
    expect(edgecaseSequence[1].getNextStep({})).toBe(FULL_NAME);

    expect(edgecaseSequence[2].url).toBe(FULL_NAME);
    expect(edgecaseSequence[2].getNextStep({})).toBe(DATE_OF_BIRTH);

    expect(edgecaseSequence[3].url).toBe(DATE_OF_BIRTH);
    expect(edgecaseSequence[3].getNextStep({})).toBe(FIND_ADDRESS);

    expect(edgecaseSequence[4].url).toBe(FIND_ADDRESS);
    expect(edgecaseSequence[4].getNextStep({})).toBe(SELECT_ADDRESS);

    expect(edgecaseSequence[5].url).toBe(SELECT_ADDRESS);
    expect(edgecaseSequence[5].getNextStep({})).toBe(CONTACT_PREFERENCES);

    expect(edgecaseSequence[6].url).toBe(MANUAL_ADDRESS);
    expect(edgecaseSequence[6].getNextStep({})).toBe(CONTACT_PREFERENCES);

    expect(edgecaseSequence[7].url).toBe(CONTACT_PREFERENCES);
    expect(edgecaseSequence[7].getNextStep({})).toBe(EMAIL_ADDRESS);

    expect(edgecaseSequence[8].url).toBe(EMAIL_ADDRESS);
    expect(edgecaseSequence[8].getNextStep({})).toBe(CONTACT_DETAILS);

    expect(edgecaseSequence[9].url).toBe(CONTACT_DETAILS);
    expect(edgecaseSequence[9].getNextStep({})).toBe('/upload/upload-your-documents');
    expect(
      edgecaseSequence[9].getNextStep({
        edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.FMPO,
      } as Partial<CaseWithId>)
    ).toBe('/select-court');

    expect(edgecaseSequence[10].url).toBe('/select-court');
    expect(edgecaseSequence[10].getNextStep({})).toBe('/upload/upload-your-documents');

    expect(edgecaseSequence[11].url).toBe(UPLOAD_YOUR_DOCUMENTS);
    expect(edgecaseSequence[11].getNextStep({})).toBe('/upload/upload-additional-documents');

    expect(edgecaseSequence[12].url).toBe(ADDITIONAL_DOCUMENTS_UPLOAD);
    expect(edgecaseSequence[12].getNextStep({})).toBe(CHECK_YOUR_ANSWERS);

    expect(edgecaseSequence[13].url).toBe(CHECK_YOUR_ANSWERS);
    expect(edgecaseSequence[13].getNextStep({})).toBe(STATEMENT_OF_TRUTH);

    expect(edgecaseSequence[14].url).toBe(STATEMENT_OF_TRUTH);
    expect(edgecaseSequence[14].getNextStep({})).toBe('/pay-your-fee');
    expect(
      edgecaseSequence[14].getNextStep({
        edgeCaseTypeOfApplication: TYPE_OF_APPLICATION.FMPO,
      } as Partial<CaseWithId>)
    ).toBe('/application-submitted');

    expect(edgecaseSequence[15].url).toBe('/pay-your-fee');
    expect(edgecaseSequence[15].getNextStep({})).toBe('/help-with-fee');

    expect(edgecaseSequence[16].url).toBe('/help-with-fee');
    expect(edgecaseSequence[16].getNextStep({})).toBe('/logout');

    expect(edgecaseSequence[17].url).toBe('/application-submitted');
    expect(edgecaseSequence[17].getNextStep({})).toBe('/type-of-application');

    expect(edgecaseSequence[18].url).toBe('/user-role');
    expect(edgecaseSequence[18].getNextStep({})).toBe('/full-name');

    expect(edgecaseSequence[19].url).toBe('/cookies');
    expect(edgecaseSequence[19].getNextStep({})).toBe('/user-role');
  });
});
