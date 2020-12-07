const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams} from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { ISitesClientV1 } from './ISitesClientV1';
import { SiteV1 } from './SiteV1';

export class SitesMemoryClientV1 implements ISitesClientV1 {
    private _sites: SiteV1[] = [];
            
    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: SiteV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let code = filter.getAsNullableString('code');
        let active = filter.getAsNullableBoolean('active');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
                
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (code && item.code != code) 
                return false;
            if (active && item.active != active) 
                return false;
            if (!deleted && item.deleted) 
                return false;
            if (search && !this.matchSearch(item, search)) 
                return false;
            return true; 
        };
    }

    public getSites(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<SiteV1>) => void): void {
        
        let sites = _.filter(this._sites, this.composeFilter(filter));
        callback(null, new DataPage<SiteV1>(sites, sites.length));
    }

    public getSiteById(correlationId: string, siteId: string, 
        callback: (err: any, site: SiteV1) => void): void {

        let site = _.find(this._sites, (d) => d.id == siteId);
        callback(null, site);
    }

    public getSiteByCode(correlationId: string, code: string, 
        callback: (err: any, site: SiteV1) => void): void {

        let site = _.find(this._sites, (d) => d.code == code);
        callback(null, site);
    }

    public generateCode(correlationId: string, siteId: string, 
        callback: (err: any, code: string) => void): void {
        callback(null, siteId);
    }

    public createSite(correlationId: string, site: SiteV1, 
        callback: (err: any, site: SiteV1) => void): void {

        site.id = site.id || IdGenerator.nextLong();
        site.create_time = new Date();
        site.active = site.active != null || true;

        this._sites.push(site);
        callback(null, site);
    }

    public updateSite(correlationId: string, site: SiteV1, 
        callback: (err: any, site: SiteV1) => void): void {

        this._sites = _.filter(this._sites, (d) => d.id != site.id);
        this._sites.push(site);
        
        callback(null, site);
    }

    public deleteSiteById(correlationId: string, siteId: string,
        callback: (err: any, site: SiteV1) => void): void {

        let site = _.find(this._sites, (d) => d.id == siteId);
        if (site) {
            site.deleted = true;
        }
        
        callback(null, site);
    }

}