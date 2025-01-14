import { YesOrNo } from 'app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';

export const en = (): Record<string, unknown> => ({
  hwfTextOption: "I need help paying the fee",
  hwfReferenceNumberText: "I already have a help with fees reference number",
  hwfReferenceInputText: "help with fees reference number",
  continue: "Save and submit application"
});

export const cy = (): Record<string, unknown> => ({
  hwfTextOption: "I need help paying the fee (welsh)",
  hwfReferenceNumberText: "I already have a help with fees reference number (welsh)",
  hwfReferenceInputText: "help with fees reference number (welsh)",
  continue: "Save and submit application (welsh)"
});

export const form: FormContent = {
  fields: {
    hwfFields: {
      type: 'radios',
      classes: 'govuk-radios',
      label: l => '',
      labelSize: 'm',
      section: l => l.section,
      values: [
        {
          label: l => l.hwfTextOption,
          value: YesOrNo.YES,
        },
        {
          label: l => l.hwfReferenceNumberText,
          value: YesOrNo.NO,
          subFields: {
            helpWithFeesReferenceNumber: {
              type: 'input',
              label: l => l.hwfReferenceInputText,
              labelSize: null,
              hint: l => l.explainNoHint,
              id: 'helpWithFeesReferenceNumber',
              validator: value => isFieldFilledIn(value),
            },
          },
        },
      ],
      validator: isFieldFilledIn
    },
  },
  submit: {
    text: l => l.continue,
  },
  saveAsDraft: {
    text: l => l.saveAsDraft,
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
