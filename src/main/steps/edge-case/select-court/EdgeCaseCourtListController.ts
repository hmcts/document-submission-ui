import { CourtListOptions } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';

let courtList: CourtListOptions[] = [];

export class EdgeCaseCourtListController {
  public async initializeContent(req: AppRequest): Promise<void> {
    await this.getCourtList(req);
  }

  public async getCourtList(req: AppRequest): Promise<CourtListOptions[]> {
    courtList = await req.locals.api.getCourtList();
    return courtList;
  }

  public getCourtListData(): CourtListOptions[] {
    return courtList;
  }
}
