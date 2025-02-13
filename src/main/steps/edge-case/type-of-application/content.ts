import { TYPE_OF_APPLICATION } from '../../../app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFieldsFn } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
export * from './routeGuard';

export const form: FormContent = {
  fields: () => {
    return {
      edgeCaseTypeOfApplication: {
        type: 'radios',
        classes: 'govuk-radios',
        label: l => l.label,
        selected: false,
        values: [
          { label: l => l.fgm, value: TYPE_OF_APPLICATION.FGM },
          { label: l => l.fmpo, value: TYPE_OF_APPLICATION.FMPO },
          { label: l => l.sg, value: TYPE_OF_APPLICATION.SPECIAL_GUARDIANSHIP_ORDER },
          { label: l => l.dop, value: TYPE_OF_APPLICATION.DECLARATION_OF_PARENTAGE },
          { label: l => l.po, value: TYPE_OF_APPLICATION.PARENTAL_ORDER },
        ],
        validator: isFieldFilledIn,
      },
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader('type-of-application');
  const translations = resourceLoader.getFileContents();

  return {
    ...translations?.translations?.[content.language],
    errors: {
      ...translations?.errors?.[content.language],
    },
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}, content.additionalData?.req) },
  };
};
