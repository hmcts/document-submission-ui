import { CaseWithId } from '../../../app/case/case';
import { CourtListOptions } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { isValidOption } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
export * from './routeGuard';

export const form: FormContent = {
  fields: (userCase: Partial<CaseWithId>, req: AppRequest): FormFields => {
    return {
      selectedCourtId: {
        type: 'select',
        label: l => l.label,
        labelSize: null,
        validator: isValidOption,
        options: l => {
          const courts = [...req.session.applicationSettings.availableCourts].map((court: CourtListOptions) => ({
            value: court.epimms_id,
            text: court.court_name,
            selected: userCase?.selectedCourtId === court.epimms_id,
          }));

          courts?.unshift({
            text: l.selectACourt,
            value: '',
            selected: !userCase?.selectedCourtId,
          });

          return courts as [];
        },
      },
    };
  },
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader('select-court');
  const translations = resourceLoader.getFileContents();
  const fields = (form.fields as FormFieldsFn)(content.userCase || {}, content.additionalData?.req);

  return {
    ...translations?.translations?.[content.language],
    errors: {
      ...translations?.errors?.[content.language],
    },
    form: { ...form, fields },
  };
};
