import { getFormattedAddress } from './address';

describe('address', () => {
  const data = {
    applicantAddressCounty: 'CITY OF WESTMINSTER',
    applicantAddressPostcode: 'SW1H 9AJ',
    applicantAddress1: '102 MINISTRY OF JUSTICE, SEVENTH FLOOR, PETTY FRANCE',
    applicantAddress2: '',
    applicantAddress3: '',
    applicantAddressTown: 'LONDON',
    applicantAddressCountry: 'UK',
  };
  test('should return correct HTML', () => {
    expect(getFormattedAddress(data)).toBe(
      '102 MINISTRY OF JUSTICE, SEVENTH FLOOR, PETTY FRANCE<br>LONDON<br>CITY OF WESTMINSTER<br>SW1H 9AJ<br>UK'
    );
  });
});
