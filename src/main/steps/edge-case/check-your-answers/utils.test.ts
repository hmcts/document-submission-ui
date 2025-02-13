import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockUserCase1, mockUserCase2, mockUserCase3 } from '../../../../test/unit/utils/mockUserCase';
import { AppSession } from '../../../app/controller/AppRequest';

//mockUserCase2, mockUserCase3

import { enContent } from './content';
import { AdditonalFormSummary, ApplicantSummaryList, UploadFormSummary, UserRole } from './utils';
/**AdditonalFormSummary UploadFormSummary   */

describe('upload-addition-documents > check-your-answers', () => {
  describe('applicationSummaryList', () => {
    test.each([
      // {
      //   session:{
      //   userCase: {
      //     ...mockUserCase1,
      //     selectedCourtId:"12"
      //   },
      // },
      {
        req: {
          ...mockRequest,
          session: {
            userCase: {
              ...mockUserCase1,
              selectedCourtId: '12',
            },
          },
        },

        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/full-name',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s name',
                  },
                ],
              },
              key: { text: 'Subject’s name' },
              value: { text: 'Joe Bob' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/date-of-birth',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s DoB',
                  },
                ],
              },
              key: { text: 'Subject’s DoB' },
              value: { text: '27 December 1829' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/address/manual',
                    text: 'change',
                    visuallyHiddenText: 'Address',
                  },
                ],
              },
              key: { text: 'Address' },
              value: { html: '100 Dummy Avenue<br>DummyCity<br>CITY OF Dummy<br>G11 XXL' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-preferences',
                    text: 'change',
                    visuallyHiddenText: 'Who should receive emails about the application',
                  },
                ],
              },
              key: { text: 'Who should receive emails about the application' },
              value: { text: 'The account owner' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/email-address',
                    text: 'change',
                    visuallyHiddenText: 'Email address of the person named on the application',
                  },
                ],
              },
              key: { text: 'Email address of the person named on the application' },
              value: { text: 'dummy@bob.com' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-details',
                    text: 'change',
                    visuallyHiddenText: 'Contact number of the person named on the application',
                  },
                ],
              },
              key: { text: 'Contact number of the person named on the application' },
              value: { text: '012345678910' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ req, expected }) => {
      expect(ApplicantSummaryList(enContent, req.session as AppSession, 'en')).not.toBe(expected);
    });
  });
});

describe('upload-addition-documents > named owner > check-your-answers', () => {
  describe('applicationSummaryList', () => {
    test.each([
      {
        session: {
          userCase: {
            ...mockUserCase2,
            selectedCourtId: '12',
          },
        },

        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/full-name',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s name',
                  },
                ],
              },
              key: { text: 'Subject’s name' },
              value: { text: 'Joe Bob' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/date-of-birth',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s DoB',
                  },
                ],
              },
              key: { text: 'Subject’s DoB' },
              value: { text: '27 December 1829' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/address/manual',
                    text: 'change',
                    visuallyHiddenText: 'Address',
                  },
                ],
              },
              key: { text: 'Address' },
              value: { html: '100 Dummy Avenue<br>DummyCity<br>CITY OF Dummy<br>G11 XXL' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-preferences',
                    text: 'change',
                    visuallyHiddenText: 'Who should receive emails about the application',
                  },
                ],
              },
              key: { text: 'Who should receive emails about the application' },
              value: { text: 'The account owner' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/email-address',
                    text: 'change',
                    visuallyHiddenText: 'Email address of the person named on the application',
                  },
                ],
              },
              key: { text: 'Email address of the person named on the application' },
              value: { text: 'dummy@bob.com' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-details',
                    text: 'change',
                    visuallyHiddenText: 'Contact number of the person named on the application',
                  },
                ],
              },
              key: { text: 'Contact number of the person named on the application' },
              value: { text: '012345678910' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ session, expected }) => {
      expect(ApplicantSummaryList(enContent, session as AppSession, 'en')).not.toBe(expected);
    });
  });
});

describe('upload-addition-documents > named owner and both > named owner > check-your-answers', () => {
  describe('applicationSummaryList', () => {
    test.each([
      {
        session: {
          userCase: {
            ...mockUserCase3,
            selectedCourtId: '12',
          },
        },
        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/full-name',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s name',
                  },
                ],
              },
              key: { text: 'Subject’s name' },
              value: { text: 'Joe Bob' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/date-of-birth',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s DoB',
                  },
                ],
              },
              key: { text: 'Subject’s DoB' },
              value: { text: '27 December 1829' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/address/manual',
                    text: 'change',
                    visuallyHiddenText: 'Address',
                  },
                ],
              },
              key: { text: 'Address' },
              value: { html: '100 Dummy Avenue<br>DummyCity<br>CITY OF Dummy<br>G11 XXL' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-preferences',
                    text: 'change',
                    visuallyHiddenText: 'Who should receive emails about the application',
                  },
                ],
              },
              key: { text: 'Who should receive emails about the application' },
              value: { text: 'The account owner' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/email-address',
                    text: 'change',
                    visuallyHiddenText: 'Email address of the person named on the application',
                  },
                ],
              },
              key: { text: 'Email address of the person named on the application' },
              value: { text: 'dummy@bob.com' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-details',
                    text: 'change',
                    visuallyHiddenText: 'Contact number of the person named on the application',
                  },
                ],
              },
              key: { text: 'Contact number of the person named on the application' },
              value: { text: '012345678910' },
            },
            {
              actions: {
                items: [
                  {
                    href: '/contact-details',
                    text: 'change',
                    visuallyHiddenText: 'Contact number of the person named on the application',
                  },
                ],
              },
              key: { text: 'Contact number of the person named on the application' },
              value: { text: '012345678910' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ session, expected }) => {
      expect(ApplicantSummaryList(enContent, session as AppSession, 'en')).not.toBe(expected);
    });
  });
});

describe('Addtional Form Summar> check-your-answers', () => {
  describe('applicationSummaryList', () => {
    test.each([
      {
        userCase: [{ fileName: 'a.txt' }, { fileName: 'b.txt' }],
        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/full-name',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s name',
                  },
                ],
              },
              key: { text: 'Subject’s name' },
              value: { text: 'Joe Bob' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ userCase, expected }) => {
      expect(AdditonalFormSummary(enContent, userCase)).not.toBe(expected);
    });
  });
});

describe('Form Summary > check-your-answers', () => {
  describe('applicationSummaryList', () => {
    test.each([
      {
        userCase: [{ fileName: 'a.txt' }, { fileName: 'b.txt' }],
        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/full-name',
                    text: 'change',
                    visuallyHiddenText: 'Subject’s name',
                  },
                ],
              },
              key: { text: 'Subject’s name' },
              value: { text: 'Joe Bob' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ userCase, expected }) => {
      expect(UploadFormSummary(enContent, userCase)).not.toBe(expected);
    });
  });
});

describe('Form Summary-user-role > check-your-answers', () => {
  describe('User role', () => {
    test.each([
      {
        userCase: mockUserCase1,
        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/user-role',
                    text: 'change',
                    visuallyHiddenText: 'Are you named as the applicant on the application form you are submitting?',
                  },
                ],
              },
              key: { text: 'Are you named as the applicant on the application form you are submitting?' },
              value: { text: 'No' },
            },
          ],
          title: 'Applicant details',
        },
      },
    ])('return correct summary list items when %#', ({ userCase, expected }) => {
      expect(UserRole(enContent, userCase)).not.toBe(expected);
    });
  });
});
