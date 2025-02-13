import { Response } from 'express';

import { CaseWithId } from '../../app/case/case';
import { AppRequest } from '../../app/controller/AppRequest';
import { HOME_URL, TYPE_OF_APPLICATION_URL } from '../urls';

export class HomeGetController {
  public get(req: AppRequest, res: Response): void {
    req.session.userCase = {} as CaseWithId;
    req.session.save(() => res.redirect(req.session.user ? TYPE_OF_APPLICATION_URL : HOME_URL));
  }
}
