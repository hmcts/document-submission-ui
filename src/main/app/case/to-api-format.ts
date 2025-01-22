import dayjs from 'dayjs';
import { Case, CaseDate, formFieldsToCaseMapping, formatCase } from './case';
import { CaseData } from './definition';

export type OrNull<T> = { [K in keyof T]: T[K] | null };

type ToApiConverters = Partial<Record<keyof Case, string | ((data: Case) => OrNull<Partial<CaseData>>)>>;

export const fields: ToApiConverters = {
  ...formFieldsToCaseMapping,
};

export const toApiFormat = (data: Partial<Case>): CaseData => formatCase(fields, data);

export const toApiDate = (date: CaseDate | undefined): string => {
  if (!date?.year || !date?.month || !date?.day) {
    return '';
  }
  return date.year + '-' + date.month.padStart(2, '0') + '-' + date.day.padStart(2, '0');
};

export const toDate = (date: string): CaseDate => {
  return date
    ? {
        day: dayjs(date).format('DD'),
        month: dayjs(date).format('MM'),
        year: dayjs(date).format('YYYY'),
      }
    : { day: '', month: '', year: '' };
};
