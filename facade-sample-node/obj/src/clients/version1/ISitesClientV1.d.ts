import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SiteV1 } from './SiteV1';
export interface ISitesClientV1 {
    getSites(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<SiteV1>) => void): void;
    getSiteById(correlationId: string, site_id: string, callback: (err: any, site: SiteV1) => void): void;
    getSiteByCode(correlationId: string, code: string, callback: (err: any, site: SiteV1) => void): void;
    generateCode(correlationId: string, site_id: string, callback: (err: any, code: string) => void): void;
    createSite(correlationId: string, site: SiteV1, callback: (err: any, site: SiteV1) => void): void;
    updateSite(correlationId: string, site: SiteV1, callback: (err: any, site: SiteV1) => void): void;
    deleteSiteById(correlationId: string, site_id: string, callback: (err: any, site: SiteV1) => void): void;
}
