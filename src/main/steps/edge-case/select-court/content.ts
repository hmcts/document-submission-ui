import { CourtListOptions } from '../../../app/case/definition';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { isValidOption } from '../../../app/form/validation';
import { ResourceReader } from '../../../modules/resourcereader/ResourceReader';
import { EdgeCaseCourtListController } from './EdgeCaseCourtListController';
import { CaseWithId } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';

export const form: FormContent = {
   
   fields: (userCase: Partial<CaseWithId>, req: AppRequest) : FormFields  => {
    const edgeCaseCourtService = new EdgeCaseCourtListController();
    edgeCaseCourtService.initializeContent(req);
    const courtListArray : CourtListOptions [] = edgeCaseCourtService.getCourtListData();
    let courtListData: CourtListOptions[] = courtListArray;
    console.log('--> ', courtListData);
    return {
      selectedCourt: {
        type: 'select',
        label: l => l.label,
        labelSize: null,
        validator: isValidOption,
        options: () => {
          const courtListItemOption = courtListData
            .filter(courtItem => courtItem?.site_name !== null && courtItem?.site_name !== 'Royal Courts of Justice')
            .map(option => {
              const value = `${option.epmsId}`;

              return {
                value,
                text: `${option.court_name}`,
                selected: false,
              };
            });

          courtListItemOption.unshift({
            value: '',
            text: '-- Select a value --',
            selected: false,
          });

          return courtListItemOption as [];
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
  const translations = resourceLoader.getFileContents().translations;
  const errors = resourceLoader.getFileContents().errors;

  const en = () => {
    return {
      ...translations.en,
      errors: {
        ...errors.en,
      },
    };
  };
  const cy = () => {
    return {
      ...translations.cy,
      errors: {
        ...errors.cy,
      },
    };
  };

  const languages = {
    en,
    cy,
  };
  const translationContent = languages[content.language]();
  return {
    ...translationContent,
    form: { ...form, fields: (form.fields as FormFieldsFn)(content.userCase || {}, content.additionalData?.req)},
  };
};
