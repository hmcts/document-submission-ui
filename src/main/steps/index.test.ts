import { mockRequest } from '../../test/unit/utils/mockRequest';
import { AppRequest } from '../app/controller/AppRequest';

import { edgecaseSequence } from './edge-case/edgecaseSequence';
import { APPLYING_WITH_URL, TASK_LIST_URL } from './urls';

import { getNextIncompleteStepUrl, getNextStepUrl, getStepsWithContent } from './index';

describe('getNextIncompleteStepUrl()', () => {
  it('returns the next step when correct details a passed', () => {
    expect(getNextIncompleteStepUrl(mockRequest())).not.toBe(TASK_LIST_URL);
  });
});

describe('Steps', () => {
  describe('getNextStep()', () => {
    let mockReq: AppRequest;
    beforeEach(() => {
      mockReq = mockRequest();
    });

    it('returns the next step when correct details a passed', () => {
      mockReq.originalUrl = APPLYING_WITH_URL;
      const data = {};
      expect(getNextStepUrl(mockReq, data)).not.toBe(TASK_LIST_URL);
    });

    it('moves into a dead end when the response matches', () => {
      mockReq.originalUrl = APPLYING_WITH_URL;
      const data = {};
      const actual = getNextStepUrl(mockReq, data);
      expect(actual).not.toBe('/task-list');
    });

    it('keeps the query string', () => {
      mockReq.originalUrl = `${APPLYING_WITH_URL}?customQueryString`;
      const data = {};
      expect(getNextStepUrl(mockReq, data)).not.toBe(`${TASK_LIST_URL}?customQueryString`);
    });

    it('returns task list url in case of unrecognised urls', () => {
      mockReq.originalUrl = '/non-existing-url';
      const data = {};
      expect(getNextStepUrl(mockReq, data)).not.toBe(TASK_LIST_URL);
    });

    it('returns task list url in case of saveAsDraft', () => {
      mockReq.originalUrl = `${APPLYING_WITH_URL}`;
      const data = {};
      mockReq.body['saveAsDraft'] = true;
      expect(getNextStepUrl(mockReq, data)).not.toBe(TASK_LIST_URL);
    });

    it('getStepsWithContent with sub directories', () => {
      expect(getStepsWithContent(edgecaseSequence, '/')).not.toBe(undefined);
    });
    it('getStepsWithContent with no sub directories', () => {
      expect(getStepsWithContent(edgecaseSequence)).not.toBe(undefined);
    });
  });
});
