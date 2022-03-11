import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { covertToDateObject } from '../../../app/form/parser';

export const en = (): Record<string, unknown> => ({
  section: 'Applicant',
  title: "What's your date of birth?",
  hint: 'For example, 27 3 2007',
  errors: {
    applicant1DateOfBirth: {
      required: 'Enter your date of birth',
      invalidDate: 'Date of birth must be a real date',
      incompleteDay: 'Your date of birth must include a day',
      incompleteMonth: 'Your date of birth must include a month',
      incompleteYear: 'Your date of birth must include a year',
      invalidDateInFuture: 'Your date of birth must be in the past',
    },
  },
});

export const cy = (): Record<string, unknown> => ({
  section: 'Primary applicant (in Welsh)',
  title: "What's your date of birth? (in Welsh)",
  hint: 'For example, 28 6 1997 (in Welsh)',
  errors: {
    applicant1DateOfBirth: {
      required: 'Enter your date of birth (in Welsh)',
      invalidDate: 'Date of birth must be a real date (in Welsh)',
      incompleteDay: 'Your date of birth must include a day (in Welsh)',
      incompleteMonth: 'Your date of birth must include a month (in Welsh)',
      incompleteYear: 'Your date of birth must include a year (in Welsh)',
      invalidDateInFuture: 'Your date of birth must be in the past (in Welsh)',
    },
  },
});

export const form: FormContent = {
  fields: {
    applicant1DateOfBirth: {
      type: 'date',
      classes: 'govuk-date-input',
      label: l => l.title,
      labelHidden: true,
      hint: l => l.hint,
      values: [
        {
          label: l => l.dateFormat['day'],
          name: 'day',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.dateFormat['month'],
          name: 'month',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.dateFormat['year'],
          name: 'year',
          classes: 'govuk-input--width-4',
          attributes: { maxLength: 4, pattern: '[0-9]*', inputMode: 'numeric' },
        },
      ],
      parser: body => covertToDateObject('applicant1DateOfBirth', body as Record<string, unknown>),
    },
  },
  submit: {
    text: l => l.continue,
  },
};

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => ({
  ...languages[content.language](),
  form,
});