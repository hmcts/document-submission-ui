import { YesOrNo } from '../../../app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFields, FormOptions } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { interpolate } from '../../../steps/common/string-parser';
import { PAYMENT_GATEWAY_ENTRY_URL } from '../../../steps/urls';
import { loadResources } from '../util';
export * from './routeGuard';

const PAY_YOUR_FEE_FILE = 'pay-your-fee';

export const form: FormContent = {
  fields: {
    hwfPaymentSelection: {
      type: 'radios',
      classes: 'govuk-radios',
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
      validator: isFieldFilledIn,
    },
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = loadResources(PAY_YOUR_FEE_FILE);
  const translations = resourceLoader.getFileContents().translations[content.language];
  const caseId = content.userCase?.id;
  const appRequest = content.additionalData?.req;
  const hasFeeError = appRequest.session.errors.find(error => error.errorType === 'errorFetchingFee');
  const isPaymentSuccessful = content.userCase?.paymentSuccessDetails?.status === 'Success';
  const disableForm = hasFeeError || isPaymentSuccessful;

  form.submit.disabled = disableForm;
  ((form.fields as FormFields).hwfPaymentSelection as FormOptions).values.forEach(value => {
    value.disabled = disableForm;
  });

  return {
    ...translations,
    errors: {
      ...translations.errors,
      paymentError: {
        ...translations.errors.paymentError,
        applicationNotSubmitted: interpolate(translations.errors.paymentError.applicationNotSubmitted, {
          caseId: caseId!,
        }),
      },
    },
    form,
    paymentUrl: PAYMENT_GATEWAY_ENTRY_URL,
    hasFeeError,
  };
};
