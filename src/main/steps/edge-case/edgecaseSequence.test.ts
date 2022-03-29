import { edgecaseSequence } from './edgecaseSequence';

describe('applicant1Sequence', () => {
  test('should contain 12 entries in applicant 1 screen sequence', () => {
    expect(edgecaseSequence).toHaveLength(9);

    expect(edgecaseSequence[0].url).toBe('/citizen-home');
    expect(edgecaseSequence[0].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[0].getNextStep({})).toBe('/service-type');

    expect(edgecaseSequence[1].url).toBe('/service-type');
    expect(edgecaseSequence[1].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[1].getNextStep({})).toBe('/private-law-application-type');

    expect(edgecaseSequence[2].url).toBe('/adoption-application-type');
    expect(edgecaseSequence[2].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[2].getNextStep({})).toBe('/full-name');

    expect(edgecaseSequence[3].url).toBe('/private-law-application-type');
    expect(edgecaseSequence[3].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[3].getNextStep({})).toBe('/full-name');

    expect(edgecaseSequence[4].url).toBe('/full-name');
    expect(edgecaseSequence[4].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[4].getNextStep({})).toBe('/date-of-birth');

    expect(edgecaseSequence[5].url).toBe('/date-of-birth');
    expect(edgecaseSequence[5].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[5].getNextStep({})).toBe('/address/lookup');

    expect(edgecaseSequence[6].url).toBe('/address/lookup');
    expect(edgecaseSequence[6].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[6].getNextStep({})).toBe('/address/select');

    expect(edgecaseSequence[7].url).toBe('/address/select');
    expect(edgecaseSequence[7].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[7].getNextStep({})).toBe('/address/manual');

    expect(edgecaseSequence[8].url).toBe('/address/manual');
    expect(edgecaseSequence[8].showInSection).toBe('aboutEdgeCase');
    expect(edgecaseSequence[8].getNextStep({})).toBe('/citizen-home');
  });
});
