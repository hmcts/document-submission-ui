import autobind from 'autobind-decorator';
import { Response } from 'express';

import { FieldPrefix } from '../case/case';
import { AppRequest } from '../controller/AppRequest';
import { AnyObject, PostController } from '../controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../form/Form';

@autobind
export default class SelectAddressPostControllerBase extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn, protected readonly fieldPrefix: FieldPrefix) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const form = new Form(<FormFields>this.fields);
    const { saveAndSignOut, saveBeforeSessionTimeout, _csrf, ...formData } = form.getParsedBody(req.body);

    req.session.errors = form.getErrors(formData);

    Object.assign(req.session.userCase, formData);

    const tempServiceType = req.session.userCase.serviceType;
    const tempApplyingWithAdoption = req.session.userCase.applyingWithAdoption;
    const tempApplyingWithPrivateLaw = req.session.userCase.applyingWithPrivateLaw;

    if (req.session.errors.length === 0) {
      const selectedAddressIndex = Number(formData[`${this.fieldPrefix}SelectAddress`]);
      if (selectedAddressIndex >= 0) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedAddress = req.session.addresses[selectedAddressIndex] as any;

        req.session.userCase[`${this.fieldPrefix}Address1`] = selectedAddress.street1;
        req.session.userCase[`${this.fieldPrefix}Address2`] = selectedAddress.street2;
        req.session.userCase[`${this.fieldPrefix}AddressTown`] = selectedAddress.town;
        req.session.userCase[`${this.fieldPrefix}AddressCounty`] = selectedAddress.county;
        req.session.userCase[`${this.fieldPrefix}AddressPostcode`] = selectedAddress.postcode;

        formData[`${this.fieldPrefix}Address1`] = selectedAddress.street1;
        formData[`${this.fieldPrefix}Address2`] = selectedAddress.street2;
        formData[`${this.fieldPrefix}AddressTown`] = selectedAddress.town;
        formData[`${this.fieldPrefix}AddressCounty`] = selectedAddress.county;
        formData[`${this.fieldPrefix}AddressPostcode`] = selectedAddress.postcode;

        req.session.userCase = await this.save(req, formData, this.getEventName(req));
      }
    }

    this.filterErrorsForSaveAsDraft(req);

    // here we explicitly assigning the values to userCase to get the title
    if (typeof req.session.userCase !== 'undefined' && req.session.userCase !== null) {
      req.session.userCase.serviceType = tempServiceType;
      req.session.userCase.applyingWithAdoption = tempApplyingWithAdoption;
      req.session.userCase.applyingWithPrivateLaw = tempApplyingWithPrivateLaw;
    }

    this.redirect(req, res);
  }
}
