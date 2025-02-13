import { Case } from '../case';

export const getFormattedAddress = (data: Partial<Case>): string => {
  let address: string[] = [];

  address.push(data['applicantAddress1'] ?? '');
  address.push(data['applicantAddress2'] ?? '');
  address.push(data['applicantAddress3'] ?? '');
  address.push(data['applicantAddressTown'] ?? '');
  address.push(data['applicantAddressCounty'] ?? '');
  address.push(data['applicantAddressPostcode'] ?? '');
  address.push(data['applicantAddressCountry'] ?? '');

  //remove empty items
  address = address.filter(item => !!item);

  return address.join('<br>');
};
