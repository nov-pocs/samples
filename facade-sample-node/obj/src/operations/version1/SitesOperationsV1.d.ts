import { IReferences } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';
export declare class SitesOperationsV1 extends RestOperations {
    private _rolesClient;
    private _sessionsClient;
    private _sitesClient;
    constructor();
    setReferences(references: IReferences): void;
    getSites(req: any, res: any): void;
    getAuthorizedSites(req: any, res: any): void;
    getSite(req: any, res: any): void;
    findSiteByCode(req: any, res: any): void;
    generateCode(req: any, res: any): void;
    createSite(req: any, res: any): void;
    updateSite(req: any, res: any): void;
    deleteSite(req: any, res: any): void;
    removeSite(req: any, res: any): void;
    validateSiteCode(req: any, res: any): void;
}
