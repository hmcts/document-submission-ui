import { CaseDate } from '../case/case';

import { FormField, FormOptions } from './Form';

export type DateParser = (property: string, body: Record<string, unknown>) => CaseDate;

export const covertToDateObject: DateParser = (property, body) =>
  ['day', 'month', 'year'].reduce(
    (newDateObj: CaseDate, date: string) => {
      const propertyName = `${property}-${date}`;
      newDateObj[date] = body[propertyName];
      delete body[propertyName];
      return newDateObj;
    },
    { year: '', month: '', day: '' }
  );

type CheckboxParser = () => ([key, field]: [string, FormField]) => [string, FormField];

export const setupCheckboxParser: CheckboxParser =
  () =>
  ([key, field]) => {
    if ((field as FormOptions)?.type === 'checkboxes' && key !== 'applicantStatementOfTruth') {
      field.parser = formData => {
        const checkbox = formData[key] ?? [];
        let checkboxValues;
        if ((field as FormOptions).values.length > 1) {
          checkboxValues = checkbox.filter(Boolean);
        } else {
          checkboxValues = checkbox[checkbox.length - 1];
        }

        return [[key, checkboxValues]];
      };
    }
    return [key, field];
  };
